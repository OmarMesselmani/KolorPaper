'use client';

import { useState, useEffect, useMemo } from "react";
import { getErrorMessage } from "@/lib/error";

interface AdminVisitorsProps {
  token: string;
}

interface Visitor {
  ip: string;
  userAgent: string;
  country: string;
  views: number;
  downloads: number;
  likes: number;
  lastActive: string;
  status: 'Real User' | 'Suspicious' | 'Bot';
}

export default function AdminVisitors({ token }: AdminVisitorsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Visitor; direction: 'asc' | 'desc' } | null>(null);
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

  const handleSort = (key: keyof Visitor) => {
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
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
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
    if (status === 'Bot') return <span className="px-2 py-1 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-md text-[10px] font-black uppercase tracking-wider">Bot</span>;
    if (status === 'Suspicious') return <span className="px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-md text-[10px] font-black uppercase tracking-wider">Suspicious</span>;
    return <span className="px-2 py-1 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-md text-[10px] font-black uppercase tracking-wider">Real User</span>;
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
              className="rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.2)]"
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
          <h2 className="text-2xl font-black text-[#0F0728] dark:text-white">Visitors Analytics</h2>
          <p className="text-sm text-gray-500 font-semibold mt-1">Detailed activity log for recent IPs</p>
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
                <th className="px-6 py-4 cursor-pointer hover:text-purple-600" onClick={() => handleSort('ip')}>IP Address</th>
                <th className="px-6 py-4 cursor-pointer hover:text-purple-600" onClick={() => handleSort('country')}>Country</th>
                <th className="px-6 py-4">Browser/Device</th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-purple-600" onClick={() => handleSort('views')}>Views</th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-purple-600" onClick={() => handleSort('downloads')}>Downloads</th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-purple-600" onClick={() => handleSort('likes')}>Likes</th>
                <th className="px-6 py-4 cursor-pointer hover:text-purple-600" onClick={() => handleSort('status')}>Status</th>
                <th className="px-6 py-4 cursor-pointer hover:text-purple-600" onClick={() => handleSort('lastActive')}>Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {sortedVisitors.slice(0, visibleCount).map((visitor, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">{visitor.ip}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-gray-600 dark:text-gray-400">{getCountryDisplay(visitor.country)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#0F0728] dark:text-white">{parseUserAgent(visitor.userAgent)}</span>
                      <span className="text-[10px] text-gray-400 truncate max-w-[200px]" title={visitor.userAgent}>{visitor.userAgent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-bold text-xs">
                      {visitor.views}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-bold text-xs">
                      {visitor.downloads}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-xs">
                      {visitor.likes}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(visitor.status)}
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
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-400 font-semibold text-sm">
                    No visitor data found for the recent period.
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
              Load More Visitors
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
