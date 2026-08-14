'use client';

import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminCategories from "./AdminCategories";
import AdminPages from "./AdminPages";
import AdminPosts from "./AdminPosts";
import AdminMessages from "./AdminMessages";
import AdminTags from "./AdminTags";
import AdminVisitors from "./AdminVisitors";
import AdminSettings from "./AdminSettings";

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, categories, pages, posts, messages, tags, settings
  const [initializing, setInitializing] = useState(true);
  const [adminTheme, setAdminTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('admin_theme');
    if (saved === 'light' || saved === 'dark') {
      setAdminTheme(saved);
    }
  }, []);

  useEffect(() => {
    if (adminTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    }

    return () => {
      // Restore site theme on unmount
      const siteTheme = localStorage.getItem('theme');
      if (siteTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      } else if (siteTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      }
    };
  }, [adminTheme]);

  const toggleAdminTheme = () => {
    const newTheme = adminTheme === 'dark' ? 'light' : 'dark';
    setAdminTheme(newTheme);
    localStorage.setItem('admin_theme', newTheme);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        if (!res.ok) {
          setToken(null);
          setAdmin(null);
          return;
        }

        const data = await res.json();
        setToken("cookie-session");
        setAdmin(data.admin);
      } catch {
        setToken(null);
        setAdmin(null);
      } finally {
        setInitializing(false);
      }
    };

    restoreSession();
  }, []);

  const handleLoginSuccess = (adminUser: AdminUser) => {
    setToken("cookie-session");
    setAdmin(adminUser);
    setActiveTab("dashboard");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setToken(null);
      setAdmin(null);
    }
  };

  if (initializing) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${adminTheme === 'dark' ? 'dark bg-[#070216] text-white' : 'bg-gray-50 text-gray-900'}`}>
        <svg className="animate-spin h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={`relative ${adminTheme === 'dark' ? 'dark' : ''}`}>
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
      case "tags":
        return <AdminTags token={token} />;
      case "messages":
        return <AdminMessages token={token} />;
      case "visitors":
        return <AdminVisitors token={token} />;
      case "settings":
        return <AdminSettings token={token} />;
      default:
        return <AdminDashboard token={token} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className={`min-h-screen h-screen overflow-hidden text-gray-900 dark:text-white flex flex-col md:flex-row transition-colors duration-300 ${adminTheme === 'dark' ? 'dark bg-[#070216]' : 'bg-gray-50'}`}>
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-[#0F0728] text-gray-800 dark:text-white flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-white/5 relative z-20 h-full overflow-y-auto transition-colors duration-300">
        {/* Sidebar Header Brand */}
        <div className="p-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between gap-2">
          <div className="flex flex-col items-start gap-1.5 min-w-0">
            <img src="/logo.svg" alt="KolorPaper" className="h-10 object-contain" />
            <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block mt-1">Management Console</span>
          </div>
          
          <button
            onClick={toggleAdminTheme}
            className="w-10 h-10 rounded-full border border-black/5 dark:border-white/10 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer flex-shrink-0"
            aria-label="Toggle Admin Dark Mode"
          >
            {adminTheme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* Dashboard Stats */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "dashboard" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            <span>Overview</span>
          </button>

          {/* Categories Manager */}
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "categories" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5"}`}
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "pages" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span>Coloring Pages</span>
          </button>

          {/* Blog Posts Manager */}
          <button
            onClick={() => setActiveTab("posts")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "posts" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
            </svg>
            <span>Blog Posts</span>
          </button>

          {/* Tags Manager */}
          <button
            onClick={() => setActiveTab("tags")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "tags" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
            </svg>
            <span>Tags</span>
          </button>

          {/* Messaging Panel */}
          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "messages" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            <span>Contact Messages</span>
          </button>

          {/* Visitors Analytics */}
          <button
            onClick={() => setActiveTab("visitors")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "visitors" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <span>Visitors</span>
          </button>
        </nav>

        {/* Sidebar Footer User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-white/5 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <img src="/favicon.svg" alt="Admin" className="w-8 h-8 object-contain" />
            <div className="min-w-0">
              <span className="block text-xs font-extrabold truncate text-gray-800 dark:text-white">{admin?.name || "Administrator"}</span>
              <span className="block text-[9px] text-gray-500 truncate">{admin?.email}</span>
            </div>
          </div>
          {/* Settings */}
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-300 ${activeTab === "settings" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center px-4 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 h-full bg-gray-50 dark:bg-[#070216] text-gray-900 dark:text-white transition-colors duration-300">
        {renderActivePanel()}
      </main>
    </div>
  );
}
