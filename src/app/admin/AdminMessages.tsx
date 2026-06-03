'use client';

import { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { getErrorMessage } from "@/lib/error";

interface AdminMessagesProps {
  token: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessages({ token }: AdminMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Modal View State
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        unreadOnly: unreadOnly.toString()
      });

      const res = await fetch(`${API_URL}/admin/messages?${queryParams.toString()}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to load contact messages.");

      const data = await res.json();
      setMessages(Array.isArray(data.messages) ? data.messages : []);
      setTotalPages(typeof data.pagination?.totalPages === "number" ? data.pagination.totalPages : 1);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Failed to load messages."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, unreadOnly, token]);

  const handleToggleRead = async (msg: Message, newReadStatus: boolean) => {
    try {
      const res = await fetch(`${API_URL}/admin/messages/${msg.id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ read: newReadStatus })
      });

      if (!res.ok) throw new Error("Failed to update message status.");

      // Update local state instantly to avoid complete reload lag
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: newReadStatus } : m));
      
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage(prev => prev ? { ...prev, read: newReadStatus } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      // Auto mark as read when viewed!
      handleToggleRead(msg, true);
    }
  };

  const initiateDelete = (id: string) => {
    setMessageToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;
    const id = messageToDelete;

    setShowDeleteModal(false);
    setMessageToDelete(null);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/admin/messages/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete message.");

      setSuccess("Message deleted successfully!");
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete message."));
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-[#0F0728] dark:text-white">Contact Message Inbox</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Read customer submissions and feedback</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => {
                setUnreadOnly(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 bg-gray-50 dark:bg-gray-950/40"
            />
            Show Unread Only
          </label>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-300 rounded-2xl text-sm font-semibold flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-950/40 border border-green-500/30 text-green-300 rounded-2xl text-sm font-semibold flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {/* Message List */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
        {messages.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-semibold text-sm">
            No contact messages found.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleOpenMessage(msg)}
                  className={`py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-950/10 px-3 rounded-2xl transition-colors ${!msg.read ? "bg-purple-50/20 dark:bg-purple-950/5" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`font-black text-sm ${!msg.read ? "text-purple-600 dark:text-purple-400" : "text-[#0F0728] dark:text-white"}`}>
                        {msg.name}
                      </span>
                      {!msg.read && (
                        <span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider scale-90">Unread</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-bold mb-1">{msg.email}</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{msg.message}</p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0">
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                    
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleRead(msg, !msg.read)}
                        className={`p-1.5 rounded-lg transition-colors ${msg.read ? "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" : "text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20"}`}
                        title={msg.read ? "Mark as unread" : "Mark as read"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839-2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V14.74Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => initiateDelete(msg.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                        title="Delete message"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500 font-bold">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Modal Overlay */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-[#070216]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative animate-zoomIn">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <span className="text-[10px] bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 font-black px-2 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-2">
                Inquiry Message
              </span>
              <h3 className="text-xl font-black text-[#0F0728] dark:text-white">{selectedMessage.name}</h3>
              <a href={`mailto:${selectedMessage.email}`} className="text-xs text-purple-600 dark:text-purple-400 font-extrabold hover:underline block mt-1">
                {selectedMessage.email}
              </a>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold block mt-1">
                Received: {new Date(selectedMessage.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-2xl p-5 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => initiateDelete(selectedMessage.id)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Delete
              </button>

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setShowDeleteModal(false);
          setMessageToDelete(null);
        }}
        title="تأكيد الحذف"
        message="هل ترغب في حذف هذه الرسالة نهائياً؟"
      />
    </div>
  );
}
