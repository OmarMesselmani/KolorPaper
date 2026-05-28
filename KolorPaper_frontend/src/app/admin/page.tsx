'use client';

import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminCategories from "./AdminCategories";
import AdminPages from "./AdminPages";
import AdminPosts from "./AdminPosts";
import AdminMessages from "./AdminMessages";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, categories, pages, posts, messages
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check for stored token on client side load
    const storedToken = localStorage.getItem("kolorpaper_admin_token");
    const storedAdmin = localStorage.getItem("kolorpaper_admin_user");
    
    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
    setInitializing(false);
  }, []);

  const handleLoginSuccess = (jwtToken: string, adminUser: any) => {
    localStorage.setItem("kolorpaper_admin_token", jwtToken);
    localStorage.setItem("kolorpaper_admin_user", JSON.stringify(adminUser));
    setToken(jwtToken);
    setAdmin(adminUser);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("kolorpaper_admin_token");
    localStorage.removeItem("kolorpaper_admin_user");
    setToken(null);
    setAdmin(null);
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070216] text-white">
        <svg className="animate-spin h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="dark">
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Active Panel Render helper
  const renderActivePanel = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard token={token} onTabChange={setActiveTab} />;
      case "categories":
        return <AdminCategories token={token} />;
      case "pages":
        return <AdminPages token={token} />;
      case "posts":
        return <AdminPosts token={token} />;
      case "messages":
        return <AdminMessages token={token} />;
      default:
        return <AdminDashboard token={token} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="dark min-h-screen h-screen overflow-hidden bg-[#070216] text-white flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0F0728] text-white flex-shrink-0 flex flex-col border-r border-white/5 relative z-20 h-full overflow-y-auto">
        {/* Sidebar Header Brand */}
        <div className="p-6 border-b border-white/5 flex flex-col items-start gap-1.5">
          <img src="/logo.png" alt="KolorPaper" className="h-10 object-contain" />
          <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block mt-1">Management Console</span>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* Dashboard Stats */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "dashboard" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            <span>Overview</span>
          </button>

          {/* Categories Manager */}
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "categories" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 0 0 3.182 0l4.318-4.318a2.25 2.25 0 0 0 0-3.182L11.16 3.659A2.25 2.25 0 0 0 9.568 3Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
            <span>Categories</span>
          </button>

          {/* Coloring Pages Manager */}
          <button
            onClick={() => setActiveTab("pages")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "pages" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span>Coloring Pages</span>
          </button>

          {/* Blog Posts Manager */}
          <button
            onClick={() => setActiveTab("posts")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "posts" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
            </svg>
            <span>Blog Posts</span>
          </button>

          {/* Messaging Panel */}
          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "messages" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            <span>Contact Messages</span>
          </button>
        </nav>

        {/* Sidebar Footer User Profile */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 flex items-center justify-center font-bold text-sm">
              {admin?.name?.substring(0, 1) || "A"}
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-extrabold truncate">{admin?.name || "Administrator"}</span>
              <span className="block text-[9px] text-gray-500 truncate">{admin?.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center px-4 py-2.5 bg-white/5 hover:bg-red-950/20 hover:text-red-400 border border-white/10 rounded-xl text-xs font-bold text-gray-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 h-full bg-[#070216] text-white">
        {renderActivePanel()}
      </main>
    </div>
  );
}
