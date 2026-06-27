'use client';

import { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

interface Tag {
  id: string;
  name: string;
  title: string | null;
  description: string | null;
  h2: string | null;
  imageUrl: string | null;
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
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Delete confirm modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'tag' | 'image'; id?: string } | null>(null);

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
        imageUrl: tag.imageUrl || "",
      });
    } else {
      setEditingTag(null);
      setFormData({ name: "", title: "", description: "", h2: "", imageUrl: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploading(true);
        setError("");
        
        const base64Data = reader.result as string;
        
        // Client-side thumbnail generation
        let thumbBase64Data = undefined;
        if (file.type.startsWith("image/")) {
          const img = new Image();
          img.src = base64Data;
          await new Promise((resolve) => { img.onload = resolve; });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const MAX_WIDTH = 400;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          thumbBase64Data = canvas.toDataURL("image/webp", 0.75);
        }

        const res = await fetch(`/api/admin/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            fileName: file.type.startsWith("image/") ? file.name.replace(/\.[^/.]+$/, ".webp") : file.name,
            fileType: "image",
            base64Data: thumbBase64Data || base64Data,
            thumbBase64Data: undefined
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setFormData(prev => ({ ...prev, imageUrl: data.url }));
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to upload file.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
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

  const triggerDeleteTag = (id: string) => {
    setDeleteTarget({ type: 'tag', id });
    setDeleteModalOpen(true);
  };

  const triggerRemoveImage = () => {
    setDeleteTarget({ type: 'image' });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'tag' && deleteTarget.id) {
      try {
        const res = await fetch(`/api/admin/tags/${deleteTarget.id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete tag");

        await fetchTags();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete tag");
      }
    } else if (deleteTarget.type === 'image') {
      setFormData(prev => ({ ...prev, imageUrl: "" }));
    }

    setDeleteModalOpen(false);
    setDeleteTarget(null);
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
                <th className="px-6 py-4 font-bold w-16">Image</th>
                <th className="px-6 py-4 font-bold">Tag Name</th>
                <th className="px-6 py-4 font-bold">Custom Title</th>
                <th className="px-6 py-4 font-bold">Custom H2</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    {tag.imageUrl ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-white/5">
                        <img src={tag.imageUrl} alt={tag.name} className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                        🎨
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-white capitalize">{tag.name}</td>
                  <td className="px-6 py-4 text-gray-300 truncate max-w-xs">{tag.title || <span className="text-gray-600 italic">Default</span>}</td>
                  <td className="px-6 py-4 text-gray-300 truncate max-w-xs">{tag.h2 || <span className="text-gray-600 italic">Default</span>}</td>
                  <td className="px-6 py-4 text-right align-middle">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(tag)}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button
                        onClick={() => triggerDeleteTag(tag.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
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
                <label className="block text-sm font-bold text-gray-300 mb-1.5">Tag Image</label>
                <div className="flex items-center gap-4">
                  {formData.imageUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#070216] border border-white/10 relative flex-shrink-0">
                      <img src={formData.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all cursor-pointer"
                      />
                      {formData.imageUrl && (
                        <button
                          type="button"
                          onClick={triggerRemoveImage}
                          className="px-3 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold rounded-xl transition-colors text-sm border border-red-500/20"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {uploading && <p className="text-purple-400 text-xs mt-2 animate-pulse">Compressing and uploading image...</p>}
                  </div>
                </div>
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
      {/* Confirm Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === 'tag' ? "تأكيد حذف الوسم" : "تأكيد إزالة الصورة"}
        message={
          deleteTarget?.type === 'tag'
            ? "هل ترغب فعلاً في حذف هذا الوسم المخصص؟ سيؤدي ذلك إلى استعادة إعدادات الـ SEO الافتراضية."
            : "هل ترغب فعلاً في إزالة صورة هذا الوسم نهائياً؟"
        }
      />
    </div>
  );
}
