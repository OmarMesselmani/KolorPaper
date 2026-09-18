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
  const [selectedClusterForIps, setSelectedClusterForIps] = useState<VisitorCluster | null>(null);
  const [ipSearchQuery, setIpSearchQuery] = useState("");
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedClusterForIps(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 1800);
  };

  const handleCopyAllIps = (ips: string[]) => {
    navigator.clipboard.writeText(ips.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1800);
  };

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

  const getDayOffset = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const targetMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const diffDays = Math.round((todayMidnight - targetMidnight) / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
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
            <tbody>
              {sortedVisitors.slice(0, visibleCount).map((visitor, idx) => {
                const dayOffset = getDayOffset(visitor.lastActive);
                const isEvenDay = Math.abs(dayOffset) % 2 === 0;

                // Color 1 for Today / Even days, Color 2 for Yesterday / Odd days
                const rowBgClass = isEvenDay
                  ? "bg-white dark:bg-gray-900/60 hover:bg-purple-500/10 dark:hover:bg-purple-500/15"
                  : "bg-slate-50/90 dark:bg-[#141c2f] hover:bg-purple-500/10 dark:hover:bg-purple-500/15";

                return (
                  <tr key={idx} className={`${rowBgClass} transition-colors`}>
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
                        {visitor.uniqueIpsCount <= 1 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-gray-700 dark:text-gray-300">1 IP</span>
                            <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded select-all" title={visitor.uniqueIps[0]}>
                              {visitor.uniqueIps[0] || 'Unknown'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 items-start">
                            <button
                              onClick={() => {
                                setSelectedClusterForIps(visitor);
                                setIpSearchQuery("");
                              }}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold text-xs transition-colors group cursor-pointer border border-indigo-500/20"
                              title="Click to view all IP addresses"
                            >
                              <span>{visitor.uniqueIpsCount} IPs</span>
                              <span className="text-[10px] opacity-75 group-hover:opacity-100 font-normal underline">View all</span>
                            </button>
                            <div 
                              onClick={() => {
                                setSelectedClusterForIps(visitor);
                                setIpSearchQuery("");
                              }}
                              className="text-[10px] text-gray-400 dark:text-gray-500 font-mono truncate max-w-[140px] cursor-pointer hover:text-indigo-400 transition-colors"
                              title={`Click to view all ${visitor.uniqueIpsCount} IPs`}
                            >
                              {visitor.uniqueIps.slice(0, 2).join(', ')}{visitor.uniqueIps.length > 2 ? ` +${visitor.uniqueIps.length - 2} more` : ''}
                            </div>
                          </div>
                        )}
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
                      <div className="flex items-center justify-center gap-2 flex-nowrap">
                        <span 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold text-xs shadow-xs"
                          title={`${visitor.views} Page Views`}
                        >
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{visitor.views}</span>
                        </span>

                        {visitor.downloads > 0 ? (
                          <span 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold text-xs shadow-xs"
                            title={`${visitor.downloads} Downloads`}
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>{visitor.downloads}</span>
                          </span>
                        ) : (
                          <span 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100/70 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 border border-gray-200/50 dark:border-gray-800/50 font-medium text-xs opacity-60"
                            title="0 Downloads"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>0</span>
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
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                            dayOffset === 0
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : dayOffset === 1
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                          }`}>
                            {dayOffset === 0 ? 'Today' : dayOffset === 1 ? 'Yesterday' : `${dayOffset}d ago`}
                          </span>
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            {new Date(visitor.lastActive).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 pl-0.5">
                          {new Date(visitor.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

      {/* IP Addresses Modal */}
      {selectedClusterForIps && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedClusterForIps(null)}
        >
          <div 
            className="bg-white dark:bg-[#0f1523] border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      {selectedClusterForIps.id}
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
                      {selectedClusterForIps.uniqueIpsCount} IPs
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold mt-0.5 flex items-center gap-2">
                    <span>{getCountryDisplay(selectedClusterForIps.country)}</span>
                    <span>•</span>
                    <span className="font-mono">{selectedClusterForIps.asn}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedClusterForIps(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter and Actions bar */}
            <div className="p-4 bg-gray-50/50 dark:bg-gray-950/30 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Filter or search IP..."
                  value={ipSearchQuery}
                  onChange={(e) => setIpSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-9 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                  autoFocus
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <button
                onClick={() => handleCopyAllIps(selectedClusterForIps.uniqueIps)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
              >
                {copiedAll ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>

            {/* IP List */}
            <div className="p-4 overflow-y-auto max-h-96 space-y-1.5">
              {selectedClusterForIps.uniqueIps
                .filter(ip => ip.toLowerCase().includes(ipSearchQuery.toLowerCase()))
                .map((ip, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 border border-gray-100 dark:border-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 font-mono w-6 text-right">
                        #{index + 1}
                      </span>
                      <span className="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 select-all">
                        {ip}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyIp(ip)}
                      className="opacity-60 group-hover:opacity-100 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-lg transition-all cursor-pointer"
                      title="Copy IP"
                    >
                      {copiedIp === ip ? (
                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Copied
                        </span>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              {selectedClusterForIps.uniqueIps.filter(ip => ip.toLowerCase().includes(ipSearchQuery.toLowerCase())).length === 0 && (
                <div className="text-center py-8 text-xs text-gray-400 font-semibold">
                  No matching IP addresses found for "{ipSearchQuery}"
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50/50 dark:bg-gray-950/20 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-medium">
                Showing {selectedClusterForIps.uniqueIps.filter(ip => ip.toLowerCase().includes(ipSearchQuery.toLowerCase())).length} of {selectedClusterForIps.uniqueIpsCount} IPs
              </span>
              <button
                onClick={() => setSelectedClusterForIps(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
