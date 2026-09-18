'use client';

import { useState, useEffect, useMemo } from "react";
import { getErrorMessage } from "@/lib/error";

interface AdminVisitorsProps {
  token: string;
}

interface VisitorCluster {
  id: string;
  country: string;
  asn: string;
  userAgent: string;
  uniqueIpsCount: number;
  uniqueIps: string[];
  views: number;
  downloads: number;
  likes: number;
  lastActive: string;
  isHosting: boolean;
  cfBotScore: number | null;
  classification: string;
}

export default function AdminVisitors({ token }: AdminVisitorsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visitors, setVisitors] = useState<VisitorCluster[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof VisitorCluster; direction: 'asc' | 'desc' } | null>(null);
  const [visibleCount, setVisibleCount] = useState(15);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/visitors`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch visitors data.");
      const data = await res.json();
      setVisitors(data.visitors || []);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load visitors."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [token]);

  const handleSort = (key: keyof VisitorCluster) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedVisitors = useMemo(() => {
    let sortableItems = [...visitors];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // Handle null values and dynamic types
        const aVal = a[sortConfig.key] as any;
        const bVal = b[sortConfig.key] as any;
        
        if (aVal === bVal) return 0;
        if (aVal === null) return 1;
        if (bVal === null) return -1;

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [visitors, sortConfig]);

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <svg className="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 font-bold p-6 bg-red-50 dark:bg-red-950/20 rounded-xl">{error}</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LIKELY BOT':
      case 'BOT':
        return <span className="px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-md text-[10px] font-black uppercase tracking-wider">Likely Bot</span>;
      case 'SUSPICIOUS':
        return <span className="px-2 py-1 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-md text-[10px] font-black uppercase tracking-wider">Suspicious</span>;
      case 'VERIFIED BOT':
        return <span className="px-2 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md text-[10px] font-black uppercase tracking-wider">Verified Bot</span>;
      case 'LIKELY HUMAN':
        return <span className="px-2 py-1 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-md text-[10px] font-black uppercase tracking-wider">Likely Human</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-md text-[10px] font-black uppercase tracking-wider">Unknown</span>;
    }
  };

  const parseUserAgent = (ua: string) => {
    const lower = ua.toLowerCase();
    if (lower.includes("googlebot") || lower.includes("bingbot") || lower.includes("yandexbot") || lower.includes("baiduspider")) return "Search Engine Bot";
    if (lower.includes("python") || lower.includes("curl") || lower.includes("wget")) return "Script / Scraper";
    if (lower.includes("chrome") && lower.includes("edg")) return "Edge";
    if (lower.includes("chrome")) return "Chrome";
    if (lower.includes("firefox")) return "Firefox";
    if (lower.includes("safari") && !lower.includes("chrome")) return "Safari";
    return "Unknown Device";
  };

  const getDeviceType = (ua: string): 'phone' | 'computer' | 'other' => {
    const lower = ua.toLowerCase();
    
    if (
      lower.includes("googlebot") || 
      lower.includes("bingbot") || 
      lower.includes("yandexbot") || 
      lower.includes("baiduspider") ||
      lower.includes("bot") ||
      lower.includes("python") || 
      lower.includes("curl") || 
      lower.includes("wget")
    ) {
      return 'other';
    }

    if (lower.includes("mobi") || lower.includes("iphone") || lower.includes("ipod") || lower.includes("windows phone") || lower.includes("blackberry")) {
      return 'phone';
    }

    if (lower.includes("windows") || lower.includes("macintosh") || lower.includes("linux") || lower.includes("cros")) {
      if (lower.includes("android") && !lower.includes("mobi")) {
        return 'other';
      }
      if (lower.includes("ipad")) {
        return 'other';
      }
      return 'computer';
    }

    return 'other';
  };

  const getDeviceIcon = (ua: string) => {
    const deviceType = getDeviceType(ua);
    
    if (deviceType === 'phone') {
      return (
        <span className="inline-flex items-center justify-center p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex-shrink-0" title="Phone">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
        </span>
      );
    }
    
    if (deviceType === 'computer') {
      return (
        <span className="inline-flex items-center justify-center p-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg flex-shrink-0" title="Computer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect width="20" height="14" x="2" y="3" rx="2" />
            <line x1="8" x2="16" y1="21" y2="21" />
            <line x1="12" x2="12" y1="17" y2="21" />
          </svg>
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center justify-center p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg flex-shrink-0" title="Other Device / Bot">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </span>
    );
  };

  const getCountryDisplay = (countryCode: string) => {
    if (!countryCode || countryCode === 'Unknown') return <span className="flex items-center gap-2">🌍 <span>Unknown</span></span>;
    
    if (countryCode.length === 2) {
      try {
        const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode.toUpperCase());
        return (
          <span className="flex items-center gap-2">
            <img 
              src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`} 
              srcSet={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png 2x`}
              width="20" 
              alt={countryCode} 
              className="shadow-[0_0_2px_rgba(0,0,0,0.2)]"
            />
            <span>{countryName || countryCode}</span>
          </span>
        );
      } catch (e) {
        return <span className="flex items-center gap-2">📍 <span>{countryCode}</span></span>;
      }
    }
    
    return <span className="flex items-center gap-2">📍 <span>{countryCode}</span></span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-[#0F0728] dark:text-white">Traffic Clusters</h2>
          <p className="text-sm text-gray-500 font-semibold mt-1">Grouped traffic based on ASN, Country, and behavior</p>
        </div>
        <button onClick={fetchVisitors} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Refresh Data
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-950/20 text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 cursor-pointer hover:text-purple-600" onClick={() => handleSort('id')}>Cluster</th>
                <th className="px-6 py-4 cursor-pointer hover:text-purple-600" onClick={() => handleSort('country')}>Location / ASN</th>
                <th className="px-6 py-4 cursor-pointer hover:text-purple-600" onClick={() => handleSort('uniqueIpsCount')}>IPs</th>
                <th className="px-6 py-4">Browser/Device</th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-purple-600" onClick={() => handleSort('views')}>Requests</th>
                <th className="px-6 py-4 cursor-pointer hover:text-purple-600" onClick={() => handleSort('classification')}>Classification</th>
                <th className="px-6 py-4 cursor-pointer hover:text-purple-600" onClick={() => handleSort('lastActive')}>Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {sortedVisitors.slice(0, visibleCount).map((visitor, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">{visitor.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-bold text-gray-600 dark:text-gray-400">{getCountryDisplay(visitor.country)}</div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{visitor.asn}</span>
                        {visitor.isHosting && <span className="text-orange-500 font-semibold" title="Hosting Datacenter">🖥️ DC</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{visitor.uniqueIpsCount} IPs</span>
                      <div className="text-[9px] text-gray-400 font-mono truncate max-w-[120px]">
                        {visitor.uniqueIps.join(', ')}{visitor.uniqueIpsCount > 5 ? '...' : ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(visitor.userAgent)}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-[#0F0728] dark:text-white truncate" title={parseUserAgent(visitor.userAgent)}>
                          {parseUserAgent(visitor.userAgent)}
                        </span>
                        <span className="text-[10px] text-gray-400 truncate max-w-[150px] md:max-w-[200px]" title={visitor.userAgent}>
                          {visitor.userAgent}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-bold text-xs" title="Views">
                        👁️ {visitor.views}
                      </span>
                      {visitor.downloads > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-bold text-xs" title="Downloads">
                          ⬇️ {visitor.downloads}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      {getStatusBadge(visitor.classification)}
                      {visitor.cfBotScore !== null && (
                        <span className="text-[10px] font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">CF Score: {visitor.cfBotScore}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-gray-500">
                      {new Date(visitor.lastActive).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
              {sortedVisitors.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400 font-semibold text-sm">
                    No traffic cluster data found for the recent period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {visibleCount < sortedVisitors.length && (
          <div className="flex justify-center p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-950/20">
            <button 
              onClick={() => setVisibleCount(v => v + 15)}
              className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              Load More Clusters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
