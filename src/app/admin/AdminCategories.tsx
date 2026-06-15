'use client';

import { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { getErrorMessage } from "@/lib/error";

interface AdminCategoriesProps {
  token: string;
}

interface Category {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  parentSlug: string | null;
  sortOrder: number;
}

export default function AdminCategories({ token }: AdminCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [parentSlug, setParentSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) throw new Error("Failed to load categories.");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Something went wrong."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    // Auto-generate slug
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric
        .replace(/\s+/g, "-") // replace spaces with dashes
        .replace(/-+/g, "-") // collapse consecutive dashes
        .trim();
      setSlug(generatedSlug);
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploading(true);
        setError("");
        setSuccess("");
        
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

        const res = await fetch(`${API_URL}/admin/upload`, {
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

        setImageUrl(data.url);
        setSuccess(`File "${file.name}" uploaded successfully!`);
      } catch (err) {
        console.error(err);
        setError(getErrorMessage(err, "Failed to upload file."));
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setImageAlt("");
    setParentSlug("");
    setSortOrder(0);
    setIsEditing(false);
    setEditId("");
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      title,
      slug,
      description: description || null,
      imageUrl: imageUrl || null,
      imageAlt: imageAlt || null,
      parentSlug: parentSlug || null,
      sortOrder: sortOrder || 0
    };

    try {
      const url = isEditing 
        ? `${API_URL}/admin/categories/${editId}` 
        : `${API_URL}/admin/categories`;
      
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed to ${isEditing ? "update" : "create"} category.`);
      }

      setSuccess(`Category successfully ${isEditing ? "updated" : "created"}!`);
      resetForm();
      fetchCategories();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to submit category."));
    }
  };

  const handleEdit = (cat: Category) => {
    setIsEditing(true);
    setEditId(cat.id);
    setTitle(cat.title);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImageUrl(cat.imageUrl || "");
    setImageAlt(cat.imageAlt || "");
    setParentSlug(cat.parentSlug || "");
    setSortOrder(cat.sortOrder);
    setShowForm(true);
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const initiateDelete = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    const id = categoryToDelete;

    setShowDeleteModal(false);
    setCategoryToDelete(null);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category.");
      }

      setSuccess("Category deleted successfully!");
      fetchCategories();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete category."));
    }
  };

  // Get only top-level parent categories for the dropdown selector
  const parentCategories = categories.filter(c => c.parentSlug === null);

  if (loading && categories.length === 0) {
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-[#0F0728] dark:text-white">Category Manager</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Organize main categories and subcategories</p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          {showForm ? (
            <span>Close Form</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Add Category</span>
            </>
          )}
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="fixed top-6 left-1/2 z-[9999] w-full max-w-md p-4 bg-red-950/90 border border-red-500/30 text-red-300 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-2xl backdrop-blur-md animate-toast">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="fixed top-6 left-1/2 z-[9999] w-full max-w-md p-4 bg-green-950/90 border border-green-500/30 text-green-300 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-2xl backdrop-blur-md animate-toast">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {/* 1. Category Form (Collapsible) */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-black text-[#0F0728] dark:text-white mb-6">
            {isEditing ? "Edit Category Details" : "Create New Category"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Birds, Fantasy Vehicles"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Slug URL (Unique)</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. birds, fantasy-vehicles"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Parent Category (Optional)</label>
              <select
                value={parentSlug}
                onChange={(e) => setParentSlug(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all appearance-none"
              >
                <option value="">-- None (Creates a top-level parent) --</option>
                {parentCategories.map(c => (
                  <option key={c.id} value={c.slug}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image Cover (Optional)</label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  {!imageUrl ? (
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${uploading ? "border-purple-500/50 bg-purple-50/10 dark:bg-purple-950/10" : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-950/40 hover:bg-gray-100/50 dark:hover:bg-gray-950/60 hover:border-purple-500/40"}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-8 h-8 mb-2 ${uploading ? "text-purple-500 animate-bounce" : "text-gray-400 dark:text-gray-500"}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                        </svg>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                          {uploading ? "Uploading cover image..." : "Click to select or upload cover image"}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-2xl p-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 flex-shrink-0">
                        <img src={imageUrl} alt="Preview" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Uploaded</span>
                          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 truncate block">{imageUrl.split('/').pop()}</span>
                        </div>
                        <div className="flex gap-2">
                          <label className="cursor-pointer text-[10px] text-purple-600 dark:text-purple-400 font-black uppercase hover:underline flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                            </svg>
                            Change File
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              disabled={uploading}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setImageUrl("")}
                            className="text-[10px] text-red-500 font-black uppercase hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Image Alt Text
                <span className="ml-2 text-purple-500 normal-case font-semibold">(SEO)</span>
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder={`e.g. ${title || 'Category'} coloring pages cover image`}
                maxLength={200}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all"
              />
              <p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                📷 Describe the image for search engines and screen readers · Max 200 chars
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description for coloring pages index headers..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all resize-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-all hover:opacity-90"
              >
                {isEditing ? "Update Category" : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Categories Hierarchical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Render Parent Categories */}
        {parentCategories.map((parent) => {
          const children = categories.filter(c => c.parentSlug === parent.slug);
          return (
            <div key={parent.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Parent
                    </span>
                    <h4 className="text-base font-black text-[#0F0728] dark:text-white mt-1">{parent.title}</h4>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold block">slug: {parent.slug}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleEdit(parent)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-all" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 18.291a8.9 8.9 0 0 1-3.064 1.983L3 20.782l.497-3.078a8.9 8.9 0 0 1 1.984-3.064L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button onClick={() => initiateDelete(parent.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{parent.description || "No description provided."}</p>
              </div>

              {/* Display Subcategories under this parent */}
              <div className="border-t border-gray-100 dark:border-white/5 pt-4">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block mb-2">Subcategories ({children.length})</span>
                {children.length === 0 ? (
                  <span className="text-xs text-gray-400 dark:text-gray-600 italic">No subcategories</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {children.map(child => (
                      <div key={child.id} className="group/child flex items-center gap-1 text-[11px] bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl pl-2.5 pr-1.5 py-1 text-gray-600 dark:text-gray-300 font-bold relative">
                        <span>{child.title}</span>
                        <div className="flex items-center opacity-0 group-hover/child:opacity-100 transition-opacity ml-1 pl-1 border-l border-gray-200 dark:border-white/10 gap-0.5">
                          <button onClick={() => handleEdit(child)} className="text-blue-500 hover:text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 18.291a8.9 8.9 0 0 1-3.064 1.983L3 20.782l.497-3.078a8.9 8.9 0 0 1 1.984-3.064L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button onClick={() => initiateDelete(child.id)} className="text-red-500 hover:text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        }}
        title="تأكيد الحذف"
        message="هل ترغب في حذف هذا القسم نهائياً؟"
      />
    </div>
  );
}
