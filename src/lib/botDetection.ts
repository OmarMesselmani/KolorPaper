import { NextRequest } from "next/server";

export interface BotClassification {
  classification: "LIKELY HUMAN" | "SUSPICIOUS" | "LIKELY BOT" | "VERIFIED BOT" | "UNKNOWN";
  asn: string | null;
  isHosting: boolean;
  cfBotScore: number | null;
}

const hostingASNs = ["AS132203", "AS14061", "AS16509", "AS14618", "AS8075", "AS15169"]; // Common hosting ASNs: Tencent, DigitalOcean, Amazon, Microsoft, Google

export function detectBot(req: NextRequest, existingViewsFromIP: number): BotClassification {
  // Extract Cloudflare headers
  const asn = req.headers.get("cf-ipasn") || null;
  const asnName = req.headers.get("cf-as-name") || "";
  const cfBotScoreStr = req.headers.get("cf-bot-score");
  const cfBotScore = cfBotScoreStr ? parseInt(cfBotScoreStr, 10) : null;
  
  const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";

  // 1. Cloudflare Bot Score check (If available from Cloudflare Bot Management)
  if (cfBotScore !== null) {
    if (cfBotScore <= 9) return { classification: "LIKELY BOT", asn, isHosting: false, cfBotScore };
    if (cfBotScore <= 19) return { classification: "SUSPICIOUS", asn, isHosting: false, cfBotScore };
    return { classification: "LIKELY HUMAN", asn, isHosting: false, cfBotScore }; // 20+ is human
  }

  // 2. Clear Bot / Scraper User-Agent Check
  const botUserAgents = [
    'bot', 'crawler', 'spider', 'curl', 'wget', 'python', 'postman',
    'httpclient', 'headless', 'puppeteer', 'selenium', 'playwright',
    'scrapy', 'go-http-client', 'ahrefs', 'semrush', 'bytespider', 'yandex'
  ];
  if (botUserAgents.some(botWord => userAgent.includes(botWord))) {
    return { classification: "LIKELY BOT", asn, isHosting: false, cfBotScore: null };
  }

  // Missing or empty User-Agent is typically automated scripts
  if (!userAgent || userAgent.length < 10) {
    return { classification: "LIKELY BOT", asn, isHosting: false, cfBotScore: null };
  }

  // 3. Heuristic Scoring for real browsers
  let score = 0;
  let isHosting = false;

  // Datacenter/Hosting check (moderate weight, doesn't immediately condemn real VPN / iCloud Private Relay users)
  if ((asn && hostingASNs.includes(asn)) || asnName.toLowerCase().includes("hosting") || asnName.toLowerCase().includes("datacenter")) {
    score += 15;
    isHosting = true;
  }

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
