'use client';

import { useState, useEffect } from "react";

interface Tag {
  id: string;
  name: string;
  title: string | null;
  description: string | null;
  h2: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTags({ token }: { token: string }) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    h2: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/tags");
      if (!res.ok) throw new Error("Failed to fetch tags");
      const data = await res.json();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching tags");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        name: tag.name,
        title: tag.title || "",
        description: tag.description || "",
        h2: tag.h2 || "",
      });
    } else {
      setEditingTag(null);
      setFormData({ name: "", title: "", description: "", h2: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const url = editingTag ? `/api/admin/tags/${editingTag.id}` : "/api/admin/tags";
      const method = editingTag ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save tag");
      }

      await fetchTags();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this custom tag? It will revert to default SEO.")) return;

    try {
      const res = await fetch(`/api/admin/tags/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete tag");

      await fetchTags();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tag");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Custom Tags</h1>
          <p className="text-gray-400 text-sm mt-1">Manage SEO and display information for specific tags.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-colors text-sm"
        >
          + Add Custom Tag
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {tags.length === 0 ? (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 0 0 3.182 0l4.318-4.318a2.25 2.25 0 0 0 0-3.182L11.16 3.659A2.25 2.25 0 0 0 9.568 3Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No custom tags yet</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">Create a custom tag to override the default SEO title, description, and H2 heading for specific tag pages.</p>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors text-sm"
          >
            Create First Tag
          </button>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-bold">Tag Name</th>
                <th className="px-6 py-4 font-bold">Custom Title</th>
                <th className="px-6 py-4 font-bold">Custom H2</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-bold text-white capitalize">{tag.name}</td>
                  <td className="px-6 py-4 text-gray-300 truncate max-w-xs">{tag.title || <span className="text-gray-600 italic">Default</span>}</td>
                  <td className="px-6 py-4 text-gray-300 truncate max-w-xs">{tag.h2 || <span className="text-gray-600 italic">Default</span>}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleOpenModal(tag)}
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0728] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingTag ? `Edit Tag: ${editingTag.name}` : "Create Custom Tag"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">Tag Name (e.g. rabbit) *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#070216] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all"
                  placeholder="rabbit"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">Custom Title (SEO)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#070216] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all"
                  placeholder="Rabbit Coloring Pages"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">Custom H2 Heading</label>
                <input
                  type="text"
                  value={formData.h2}
                  onChange={(e) => setFormData({ ...formData, h2: e.target.value })}
                  className="w-full bg-[#070216] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all"
                  placeholder="Rabbit Coloring Pages"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">Custom Description (SEO & UI)</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#070216] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all resize-none"
                  placeholder="Discover free printable rabbit coloring pages for kids..."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Tag'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
