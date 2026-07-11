'use client';

import { useState, useEffect } from "react";
import { getErrorMessage } from "@/lib/error";

interface AdminDashboardProps {
  token: string;
  onTabChange: (tab: string) => void;
}

interface StatsSummary {
  totalPages: number;
  totalCategories: number;
  totalViews: number;
  totalDownloads: number;
  totalLikes: number;
  yesterdayViews?: number;
  yesterdayDownloads?: number;
  yesterdayLikes?: number;
  totalMessages: number;
  unreadMessages: number;
}

interface PopularPage {
  id: string;
  title: string;
  slug: string;
  views: number;
  downloads: number;
  likes: number;
  categorySlug: string;
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ActivityDay {
  date: string;
  views: number;
  downloads: number;
  visitors: number;
}

export default function AdminDashboard({ token, onTabChange }: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [popularPages, setPopularPages] = useState<PopularPage[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [timeline, setTimeline] = useState<ActivityDay[]>([]);
  const [timeRange, setTimeRange] = useState("7");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/admin/stats?range=${timeRange}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard statistics.");
      }

      const data = await res.json();
      setStats(data.summary);
      setPopularPages(data.popularPages);
      setRecentMessages(data.recentMessages);
      setTimeline(data.activityTimeline);
    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError(getErrorMessage(err, "Failed to load dashboard data."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token, timeRange]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <svg className="animate-spin h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-gray-500 font-semibold text-sm">Aggregating workspace metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-3xl text-sm font-semibold flex flex-col items-center gap-4 max-w-lg mx-auto mt-12">
        <span className="text-center">{error}</span>
        <button onClick={fetchStats} className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-500 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  // Render SVG charts
  const renderChart = () => {
    if (timeline.length === 0) return null;

    const chartHeight = 160;
    const chartWidth = 500;
    const maxVal = Math.max(...timeline.map(d => Math.max(d.views, d.downloads, d.visitors || 0)), 10);
    
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const scaleX = chartWidth / rect.width;
      const viewBoxX = x * scaleX;
      
      let index = Math.round((viewBoxX / chartWidth) * (timeline.length - 1));
      if (index < 0) index = 0;
      if (index >= timeline.length) index = timeline.length - 1;
      
      setHoverIndex(index);
    };

    const handleMouseLeave = () => {
      setHoverIndex(null);
    };

    // Generate smooth paths for lines
    let pathViews = "";
    let pathDownloads = "";
    let pathVisitors = "";

    timeline.forEach((day, index) => {
      const x = (index / (timeline.length - 1)) * chartWidth;
      
      const yViews = chartHeight - (day.views / maxVal) * chartHeight;
      const yDownloads = chartHeight - (day.downloads / maxVal) * chartHeight;
      const yVisitors = chartHeight - ((day.visitors || 0) / maxVal) * chartHeight;

      if (index === 0) {
        pathViews += `M ${x},${yViews}`;
        pathDownloads += `M ${x},${yDownloads}`;
        pathVisitors += `M ${x},${yVisitors}`;
      } else {
        const prevX = ((index - 1) / (timeline.length - 1)) * chartWidth;
        const prevYViews = chartHeight - (timeline[index - 1].views / maxVal) * chartHeight;
        const prevYDownloads = chartHeight - (timeline[index - 1].downloads / maxVal) * chartHeight;
        const prevYVisitors = chartHeight - ((timeline[index - 1].visitors || 0) / maxVal) * chartHeight;
        
        const cpX = (prevX + x) / 2;
        pathViews += ` C ${cpX},${prevYViews} ${cpX},${yViews} ${x},${yViews}`;
        pathDownloads += ` C ${cpX},${prevYDownloads} ${cpX},${yDownloads} ${x},${yDownloads}`;
        pathVisitors += ` C ${cpX},${prevYVisitors} ${cpX},${yVisitors} ${x},${yVisitors}`;
      }
    });

    return (
      <div className="w-full relative">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Y Axis Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight * ratio;
            const value = Math.round(maxVal * (1 - ratio));
            return (
              <g key={i} className="opacity-10 dark:opacity-20">
                <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <text x="-5" y={y + 4} fill="currentColor" fontSize="10" textAnchor="end" className="fill-gray-500 font-bold">{value}</text>
              </g>
            );
          })}

          {/* X Axis Dates */}
          {timeline.map((day, index) => {
            // Filter labels to avoid crowding for 30-day view
            if (timeline.length > 12 && index % Math.ceil(timeline.length / 6) !== 0 && index !== timeline.length - 1 && index !== 0) return null;

            const x = (index / (timeline.length - 1)) * chartWidth;
            
            let dateStr = "";
            if (day.date.length === 7) { // YYYY-MM
              const [year, month] = day.date.split("-");
              const d = new Date(parseInt(year), parseInt(month) - 1, 1);
              dateStr = d.toLocaleDateString("en-US", { month: "short" });
            } else {
              const dateObj = new Date(day.date);
              dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }
            
            return (
              <text key={index} x={x} y={chartHeight + 16} fill="currentColor" fontSize="9" textAnchor="middle" className="fill-gray-400 font-bold opacity-80">
                {dateStr}
              </text>
            );
          })}

          {/* Views Line */}
          <path
            fill="none"
            stroke="url(#viewsGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d={pathViews}
          />

          {/* Downloads Line */}
          <path
            fill="none"
            stroke="url(#downloadsGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d={pathDownloads}
          />

          {/* Visitors Line */}
          <path
            fill="none"
            stroke="url(#visitorsGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d={pathVisitors}
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <linearGradient id="downloadsGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          {/* Hover Crosshair and Tooltip */}
          {hoverIndex !== null && timeline[hoverIndex] && (
            <g>
              {(() => {
                const x = (hoverIndex / (timeline.length - 1)) * chartWidth;
                const day = timeline[hoverIndex];
                const yViews = chartHeight - (day.views / maxVal) * chartHeight;
                const yDownloads = chartHeight - (day.downloads / maxVal) * chartHeight;
                const yVisitors = chartHeight - ((day.visitors || 0) / maxVal) * chartHeight;
                let dateStr = "";
                if (day.date.length === 7) {
                  const [year, month] = day.date.split("-");
                  dateStr = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
                } else {
                  dateStr = new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                }
                
                const tooltipX = x > chartWidth / 2 ? x - 85 : x + 10;
                
                return (
                  <>
                    <line x1={x} y1="0" x2={x} y2={chartHeight} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-gray-400 dark:text-gray-600 opacity-50" />
                    <circle cx={x} cy={yViews} r="4" fill="#8b5cf6" stroke="currentColor" strokeWidth="2" className="text-white dark:text-gray-900" />
                    <circle cx={x} cy={yDownloads} r="4" fill="#f97316" stroke="currentColor" strokeWidth="2" className="text-white dark:text-gray-900" />
                    <circle cx={x} cy={yVisitors} r="4" fill="#10b981" stroke="currentColor" strokeWidth="2" className="text-white dark:text-gray-900" />
                    
                    <g transform={`translate(${tooltipX}, 5)`}>
                      <rect x="0" y="0" width="75" height="58" rx="6" fill="currentColor" className="text-gray-800 dark:text-white shadow-lg" />
                      <text x="37.5" y="14" fill="currentColor" fontSize="9" textAnchor="middle" className="text-white dark:text-gray-900 font-black">{dateStr}</text>
                      <text x="37.5" y="26" fill="#34d399" fontSize="9" textAnchor="middle" className="font-bold">Visits: {day.visitors || 0}</text>
                      <text x="37.5" y="38" fill="#c084fc" fontSize="9" textAnchor="middle" className="font-bold">Views: {day.views}</text>
                      <text x="37.5" y="50" fill="#fb923c" fontSize="9" textAnchor="middle" className="font-bold">Down: {day.downloads}</text>
                    </g>
                  </>
                );
              })()}
            </g>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* 1. Core Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {/* Total Pages */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-wider">Pages</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#0F0728] dark:text-white">{stats?.totalPages}</h2>
        </div>

        {/* Total Categories */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-wider">Categories</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 0 0 3.182 0l4.318-4.318a2.25 2.25 0 0 0 0-3.182L11.16 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#0F0728] dark:text-white">{stats?.totalCategories}</h2>
        </div>

        {/* Total Views */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-wider">Views</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#0F0728] dark:text-white">{stats?.totalViews.toLocaleString()}</h2>
          {stats?.yesterdayViews !== undefined && (
            <span className="text-xs text-gray-400 dark:text-gray-500 font-bold mt-1 block">Last day: {stats.yesterdayViews.toLocaleString()}</span>
          )}
        </div>

        {/* Total Downloads */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-wider">Downloads</span>
            <div className="p-2 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 rounded-xl group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#0F0728] dark:text-white">{stats?.totalDownloads.toLocaleString()}</h2>
          {stats?.yesterdayDownloads !== undefined && (
            <span className="text-xs text-gray-400 dark:text-gray-500 font-bold mt-1 block">Last day: {stats.yesterdayDownloads.toLocaleString()}</span>
          )}
        </div>

        {/* Total Likes */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-wider">Likes</span>
            <div className="p-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#0F0728] dark:text-white">{stats?.totalLikes.toLocaleString()}</h2>
          {stats?.yesterdayLikes !== undefined && (
            <span className="text-xs text-gray-400 dark:text-gray-500 font-bold mt-1 block">Last day: {stats.yesterdayLikes.toLocaleString()}</span>
          )}
        </div>

        {/* Unread Messages */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
          {stats?.unreadMessages && stats.unreadMessages > 0 ? (
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-full"></div>
          ) : null}
          <div className="flex justify-between items-start mb-3">
            <span className="text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-wider">Messages</span>
            <div className="p-2 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-xl group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#0F0728] dark:text-white">
            {stats?.unreadMessages}
            <span className="text-xs text-gray-400 font-normal ml-1">/{stats?.totalMessages} unread</span>
          </h2>
        </div>
      </div>

      {/* 2. Charts / Analytics Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-[#0F0728] dark:text-white">Traffic Timeline</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Comparative views vs. downloads count</p>
            </div>
            
            <div className="flex items-center gap-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-600 dark:text-gray-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer appearance-none"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="365">Last 12 Months</option>
              </select>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <span className="w-3 h-1 bg-green-500 rounded-full inline-block"></span> Visitors
                </span>
                <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                  <span className="w-3 h-1 bg-purple-500 rounded-full inline-block"></span> Views
                </span>
                <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                  <span className="w-3 h-1 bg-orange-500 rounded-full inline-block"></span> Downloads
                </span>
              </div>
            </div>
          </div>

          <div className="pl-6 pr-2 pt-2 pb-6">
            {renderChart()}
          </div>
        </div>

        {/* 3. Messages Snippet Panel */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black text-[#0F0728] dark:text-white">Recent Inbox</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Latest customer feedback messages</p>
              </div>
              <button onClick={() => onTabChange("messages")} className="text-xs text-purple-600 dark:text-purple-400 font-black hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentMessages.length === 0 ? (
                <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">
                  Inbox is currently empty.
                </div>
              ) : (
                recentMessages.map((msg) => (
                  <div key={msg.id} className="p-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-2xl flex flex-col gap-1.5 relative hover:-translate-y-0.5 transition-transform">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-sm text-[#0F0728] dark:text-white truncate max-w-[120px]">{msg.name}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{msg.message}</p>
                    {!msg.read && (
                      <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Popular Pages Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-black text-[#0F0728] dark:text-white">Popular Printable Coloring Pages</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Sorted by view count in database</p>
          </div>
          <button onClick={() => onTabChange("pages")} className="text-xs text-purple-600 dark:text-purple-400 font-black hover:underline">
            Manage Pages
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-center">Views</th>
                <th className="pb-3 text-center">Downloads</th>
                <th className="pb-3 text-center">Likes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm font-semibold text-gray-600 dark:text-gray-300">
              {popularPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/20 transition-colors">
                  <td className="py-4 pl-2 font-extrabold text-[#0F0728] dark:text-white">{page.title}</td>
                  <td className="py-4 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">{page.categorySlug}</td>
                  <td className="py-4 text-center font-bold">{page.views.toLocaleString()}</td>
                  <td className="py-4 text-center font-bold">{page.downloads.toLocaleString()}</td>
                  <td className="py-4 text-center font-bold text-red-500">{page.likes.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
