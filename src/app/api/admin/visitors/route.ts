import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "100", 10);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days
    
    const pageViews = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: startDate },
        ip: { not: null }
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ip: true,
        action: true,
        userAgent: true,
        country: true,
        asn: true,
        isHosting: true,
        cfBotScore: true,
        classification: true,
        createdAt: true
      }
    });

    // We will group visitors into "Traffic Clusters" based on Country, ASN, and User-Agent
    const clustersMap = new Map<string, {
      id: string; // cluster ID
      country: string;
      asn: string;
      userAgent: string;
      uniqueIps: Set<string>;
      views: number;
      downloads: number;
      likes: number;
      lastActive: Date;
      isHosting: boolean;
      cfBotScore: number | null;
      classification: string;
    }>();

    let clusterCounter = 1;

    for (const pv of pageViews) {
      if (!pv.ip) continue;
      
      const country = pv.country || 'Unknown';
      const asn = pv.asn || 'Unknown';
      const userAgent = pv.userAgent || 'Unknown';
      const classification = pv.classification || 'UNKNOWN';
      
      const clusterKey = `${country}-${asn}-${classification}`; // Grouping mostly by Country, ASN, and their Classification
      
      if (!clustersMap.has(clusterKey)) {
        clustersMap.set(clusterKey, {
          id: `Cluster #${clusterCounter++}`,
          country,
          asn,
          userAgent: userAgent,
          uniqueIps: new Set(),
          views: 0,
          downloads: 0,
          likes: 0,
          lastActive: pv.createdAt,
          isHosting: pv.isHosting || false,
          cfBotScore: pv.cfBotScore || null,
          classification
        });
      }
      
      const cluster = clustersMap.get(clusterKey)!;
      cluster.uniqueIps.add(pv.ip);
      
      if (pv.action === 'view') cluster.views++;
      else if (pv.action === 'download') cluster.downloads++;
      else if (pv.action === 'like') cluster.likes++;
      
      // Keep track of the most recent activity
      if (pv.createdAt > cluster.lastActive) {
        cluster.lastActive = pv.createdAt;
      }
    }

    const clusters = Array.from(clustersMap.values()).map(cluster => ({
      ...cluster,
      uniqueIpsCount: cluster.uniqueIps.size,
      uniqueIps: Array.from(cluster.uniqueIps).slice(0, 5) // Send up to 5 IPs for display
    }));

    // Sort by last active desc
    clusters.sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());

    return NextResponse.json({
      visitors: clusters.slice(0, limit)
    });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return NextResponse.json({ error: "Failed to fetch visitors" }, { status: 500 });
  }
}
