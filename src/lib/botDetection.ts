import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export type Classification = "LIKELY HUMAN" | "SUSPICIOUS" | "LIKELY BOT" | "VERIFIED BOT" | "UNKNOWN";

export interface BotClassification {
  classification: Classification;
  asn: string | null;
  isHosting: boolean;
  cfBotScore: number | null;
}

/**
 * Cloud providers that are a frequent source of scraper / headless-browser traffic
 * and are rarely used by real visitors (no popular consumer VPNs run on them).
 * Traffic from these networks is treated as LIKELY BOT.
 */
const SCRAPER_CLOUD_ASNS = new Set<number>([
  132203, // Tencent Cloud (international - Singapore / HK / US ...)
  45090,  // Tencent Cloud (China)
  45102,  // Alibaba Cloud (international)
  37963,  // Alibaba Cloud (China)
  136907, // Huawei Cloud
  55990,  // Huawei Cloud (China)
]);

/**
 * General hosting / datacenter providers. Some real users browse through VPNs hosted here,
 * so this is a softer signal (SUSPICIOUS) rather than an outright bot verdict.
 */
const HOSTING_ASNS = new Set<number>([
  14061,  // DigitalOcean
  16509,  // Amazon AWS
  14618,  // Amazon AWS
  8075,   // Microsoft Azure
  15169,  // Google
  396982, // Google Cloud
  24940,  // Hetzner
  16276,  // OVH
  63949,  // Linode / Akamai
  20473,  // Vultr / Choopa
  31898,  // Oracle Cloud
  51167,  // Contabo
]);

/**
 * Best-effort IPv4 ranges for the scraper clouds above.
 * Used as a fallback when the ASN is not available (local dev, or historical records stored without ASN).
 */
const SCRAPER_CLOUD_CIDRS: string[] = [
  // Tencent Cloud
  "43.128.0.0/11", "43.163.0.0/16", "43.175.0.0/16", "101.32.0.0/15", "119.28.0.0/15",
  "129.226.0.0/16", "150.109.0.0/16", "162.62.0.0/16", "170.106.0.0/16", "49.51.0.0/16",
  // Huawei Cloud
  "166.108.0.0/16", "159.138.0.0/16", "119.8.0.0/16",
  // Alibaba Cloud
  "47.74.0.0/15", "47.88.0.0/14", "47.236.0.0/14", "8.208.0.0/12", "161.117.0.0/16",
];

const ipv4ToInt = (ip: string): number | null => {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let result = 0;
  for (const part of parts) {
    const n = Number(part);
    if (!Number.isInteger(n) || n < 0 || n > 255) return null;
    result = result * 256 + n;
  }
  return result;
};

const PARSED_CIDRS = SCRAPER_CLOUD_CIDRS.map((cidr) => {
  const [base, bits] = cidr.split("/");
  const size = 2 ** (32 - Number(bits));
  const start = Math.floor((ipv4ToInt(base) ?? 0) / size) * size;
  return { start, end: start + size - 1 };
});

/** Returns true if the IP belongs to one of the known scraper clouds (Tencent / Alibaba / Huawei). */
export function isKnownScraperCloudIp(ip: string | null | undefined): boolean {
  if (!ip) return false;
  const n = ipv4ToInt(ip);
  if (n === null) return false;
  return PARSED_CIDRS.some(({ start, end }) => n >= start && n <= end);
}

/** Classifications that should NOT be counted in public counters or dashboard stats. */
export const NON_HUMAN_CLASSIFICATIONS: Classification[] = ["LIKELY BOT", "VERIFIED BOT", "SUSPICIOUS"];

export function isNonHuman(classification: string | null | undefined): boolean {
  return NON_HUMAN_CLASSIFICATIONS.includes(classification as Classification);
}

export const KNOWN_BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'curl', 'wget', 'python', 'postman',
  'httpclient', 'headless', 'puppeteer', 'selenium', 'playwright',
  'scrapy', 'go-http-client', 'ahrefs', 'semrush', 'bytespider', 'yandex',
  'phantomjs', 'node-fetch', 'axios', 'java/', 'okhttp', 'libwww',
  'lightpanda', 'petalbot', 'dataforseo', 'gptbot', 'chatgpt',
  'claudebot', 'anthropic', 'cohere', 'perplexity', 'applebot',
  'meta-externalagent'
];

export function isKnownBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.trim().length < 10) return true;
  const ua = userAgent.toLowerCase();
  return KNOWN_BOT_USER_AGENTS.some(botWord => ua.includes(botWord));
}

const parseAsn = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const n = parseInt(String(value).replace(/^AS/i, ""), 10);
  return Number.isFinite(n) ? n : null;
};

/** Reads Cloudflare request metadata (request.cf) exposed by OpenNext on Workers. */
const getCfProperties = (): { asn: number | null; asOrganization: string; botScore: number | null } => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cf = getCloudflareContext()?.cf as any;
    if (cf) {
      return {
        asn: parseAsn(cf.asn),
        asOrganization: String(cf.asOrganization || ""),
        botScore: typeof cf.botManagement?.score === "number" ? cf.botManagement.score : null,
      };
    }
  } catch {
    // Not running on Cloudflare (e.g. local `next dev`) - fall back to headers below.
  }
  return { asn: null, asOrganization: "", botScore: null };
};

export function detectBot(req: NextRequest, existingViewsFromIP: number, ip?: string): BotClassification {
  const cfProps = getCfProperties();

  // ASN: prefer native request.cf, then optional headers (e.g. a Cloudflare Transform Rule)
  const asnNumber = cfProps.asn ?? parseAsn(req.headers.get("x-visitor-asn")) ?? parseAsn(req.headers.get("cf-ipasn"));
  const asn = asnNumber !== null ? `AS${asnNumber}` : null;
  const asnName = (cfProps.asOrganization || req.headers.get("cf-as-name") || "").toLowerCase();

  const cfBotScoreStr = req.headers.get("cf-bot-score");
  const cfBotScore = cfProps.botScore ?? (cfBotScoreStr ? parseInt(cfBotScoreStr, 10) : null);

  const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";

  // 1. Clear Bot / Scraper User-Agent Check (ALWAYS RUN FIRST)
  // If the User-Agent explicitly identifies as a bot, scraper, or automation tool (e.g. Lightpanda),
  // immediately classify as LIKELY BOT regardless of any Cloudflare score.
  if (isKnownBotUserAgent(userAgent)) {
    return { classification: "LIKELY BOT", asn, isHosting: false, cfBotScore };
  }

  // 2. Cloudflare Bot Management score (when available)
  // Only trust low scores (flagged as bot/suspicious).
  // DO NOT immediately return "LIKELY HUMAN" for high scores (e.g. 99) if traffic is coming from a datacenter.
  if (cfBotScore !== null && !Number.isNaN(cfBotScore)) {
    if (cfBotScore <= 9) return { classification: "LIKELY BOT", asn, isHosting: false, cfBotScore };
    if (cfBotScore <= 19) return { classification: "SUSPICIOUS", asn, isHosting: false, cfBotScore };
  }

  // 3. Heuristic Scoring for real browsers
  let score = 0;
  let isHosting = false;

  // Scraper clouds (Tencent / Alibaba / Huawei): strong signal -> LIKELY BOT on its own
  if ((asnNumber !== null && SCRAPER_CLOUD_ASNS.has(asnNumber)) || (asnNumber === null && isKnownScraperCloudIp(ip))) {
    score += 40;
    isHosting = true;
  }
  // Other datacenters: moderate weight, doesn't immediately condemn real VPN / iCloud Private Relay users
  else if (
    (asnNumber !== null && HOSTING_ASNS.has(asnNumber)) ||
    asnName.includes("hosting") || asnName.includes("datacenter") || asnName.includes("data center")
  ) {
    score += 25;
    isHosting = true;
  }

  // Header fingerprint: real modern browsers always send these on fetch() requests.
  const isChromium = userAgent.includes("chrome/");
  if (isChromium && !req.headers.get("sec-fetch-site")) score += 25; // Spoofed Chrome UA from a script
  if (!req.headers.get("accept-language")) score += 15;               // Common in headless automation

  // Activity rate: On a coloring book website, downloading 15-50 pages is normal human activity (teachers, parents, kids).
  // Only add suspicion points if activity crosses extreme thresholds (e.g. > 60 actions in 6 hours).
  if (existingViewsFromIP > 60) score += 15;
  if (existingViewsFromIP > 120) score += 30;

  // Final classification
  let classification: "LIKELY HUMAN" | "SUSPICIOUS" | "LIKELY BOT" = "LIKELY HUMAN";
  if (score >= 40) {
    classification = "LIKELY BOT";
  } else if (score >= 25) {
    classification = "SUSPICIOUS";
  }

  return { classification, asn, isHosting, cfBotScore: null };
}
