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

  // 1. Cloudflare Bot Score check (If available)
  if (cfBotScore !== null) {
    if (cfBotScore <= 9) return { classification: "LIKELY BOT", asn, isHosting: false, cfBotScore };
    if (cfBotScore <= 29) return { classification: "SUSPICIOUS", asn, isHosting: false, cfBotScore };
    return { classification: "LIKELY HUMAN", asn, isHosting: false, cfBotScore }; // 30+ is usually human
  }

  // 2. Simple User-Agent Bot Check
  const botUserAgents = ['bot', 'crawler', 'spider', 'curl', 'wget', 'python', 'postman', 'httpclient', 'headless', 'puppeteer'];
  if (botUserAgents.some(botWord => userAgent.includes(botWord))) {
    return { classification: "LIKELY BOT", asn, isHosting: false, cfBotScore: null };
  }

  // 3. Heuristic Scoring
  let score = 0;
  let isHosting = false;

  if (asn && hostingASNs.includes(asn) || asnName.toLowerCase().includes("hosting") || asnName.toLowerCase().includes("datacenter")) {
    score += 25;
    isHosting = true;
  }

  // Activity from same IP within the short time window
  if (existingViewsFromIP > 5) score += 10;
  if (existingViewsFromIP > 15) score += 20;

  // Final classification based on points
  let classification: "LIKELY HUMAN" | "SUSPICIOUS" | "LIKELY BOT" = "LIKELY HUMAN";
  if (score >= 35) {
    classification = "LIKELY BOT";
  } else if (score >= 20) {
    classification = "SUSPICIOUS";
  }

  return { classification, asn, isHosting, cfBotScore: null };
}
