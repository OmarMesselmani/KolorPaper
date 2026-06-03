'use client';

import { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { getErrorMessage } from "@/lib/error";

interface AdminPagesProps {
  token: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  imageAlt: string | null;
  thumbnailUrl: string;
  pdfUrl: string | null;
  categorySlug: string;
  subCategorySlug: string | null;
  description: string | null;
  difficulty: string | null;
  ageGroup: string | null;
  tags?: string[];
  views: number;
  downloads: number;
  likes: number;
  published: boolean;
}

interface Category {
  id: string;
  title: string;
  slug: string;
  parentSlug: string | null;
}

export default function AdminPages({ token }: AdminPagesProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterAgeGroup, setFilterAgeGroup] = useState("");

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [subCategorySlug, setSubCategorySlug] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [ageGroup, setAgeGroup] = useState("kids");
  const [tagsInput, setTagsInput] = useState("");
  const [published, setPublished] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "thumbnail") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploadingField(field);
        setError("");
        setSuccess("");
        
        const base64Data = reader.result as string;
        
        // Client-side thumbnail generation
        let thumbBase64Data = undefined;
        if (field === "image" && file.type.startsWith("image/")) {
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
            fileName: file.name,
            fileType: field === "image" ? "image" : "thumbnail",
            base64Data,
            thumbBase64Data
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        if (field === "image") {
          setImageUrl(data.url);
          // Use the auto-generated WebP thumbnail from the backend (sharp), or fall back to original
          setThumbnailUrl(data.thumbnailUrl || data.url);
        } else if (field === "thumbnail") {
          setThumbnailUrl(data.url);
        }

        setSuccess(`File "${file.name}" uploaded successfully!`);
      } catch (err) {
        console.error(err);
        setError(getErrorMessage(err, "Failed to upload file."));
      } finally {
        setUploadingField(null);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError("");

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search,
        categorySlug: filterCategory,
        difficulty: filterDifficulty,
        ageGroup: filterAgeGroup,
        sortBy: "createdAt",
        order: "desc"
      });

      const res = await fetch(`${API_URL}/pages?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to load coloring pages.");
      
      const data = await res.json();
      setPages(data.pages);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Failed to load pages."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPages();
  }, [page, filterCategory, filterDifficulty, filterAgeGroup]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPages();
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setSlug(generatedSlug);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setImageUrl("");
    setImageAlt("");
    setThumbnailUrl("");
    setCategorySlug("");
    setSubCategorySlug("");
    setDescription("");
    setDifficulty("medium");
    setAgeGroup("kids");
    setTagsInput("");
    setPublished(true);
    setIsEditing(false);
    setEditId("");
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!categorySlug) {
      setError("Please select a category.");
      return;
    }

    const payload = {
      title,
      slug,
      imageUrl,
      imageAlt: imageAlt || null,
      thumbnailUrl: thumbnailUrl || imageUrl, // default thumbnail to main image if empty
      pdfUrl: null,
      categorySlug,
      subCategorySlug: subCategorySlug || null,
      description: description || null,
      difficulty,
      ageGroup,
      tags: tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [],
      published
    };

    try {
      const url = isEditing 
        ? `${API_URL}/admin/pages/${editId}` 
        : `${API_URL}/admin/pages`;
      
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
        throw new Error(data.error || `Failed to ${isEditing ? "update" : "create"} coloring page.`);
      }

      setSuccess(`Coloring page successfully ${isEditing ? "updated" : "created"}!`);
      resetForm();
      fetchPages();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save coloring page."));
    }
  };

  const handleEdit = (page: Page) => {
    setIsEditing(true);
    setEditId(page.id);
    setTitle(page.title);
    setSlug(page.slug);
    setImageUrl(page.imageUrl);
    setImageAlt(page.imageAlt || "");
    setThumbnailUrl(page.thumbnailUrl);
    setCategorySlug(page.categorySlug);
    setSubCategorySlug(page.subCategorySlug || "");
    setDescription(page.description || "");
    setDifficulty(page.difficulty || "medium");
    setAgeGroup(page.ageGroup || "kids");
    setTagsInput(page.tags?.join(", ") || "");
    setPublished(page.published);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const initiateDelete = (id: string) => {
    setPageToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pageToDelete) return;
    const id = pageToDelete;

    setShowDeleteModal(false);
    setPageToDelete(null);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/admin/pages/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete coloring page.");
      }

      setSuccess("Coloring page deleted successfully!");
      fetchPages();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete page."));
    }
  };

  // Get parents for dropdown
  const parentCategories = categories.filter(c => c.parentSlug === null);
  // Get children of the selected category for subcategory dropdown
  const subCategories = categorySlug 
    ? categories.filter(c => c.parentSlug === categorySlug) 
    : [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-[#0F0728] dark:text-white">Coloring Pages Manager</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Add, edit, or delete coloring pages</p>
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
              <span>Add Coloring Page</span>
            </>
          )}
        </button>
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

      {/* 1. Add/Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-black text-[#0F0728] dark:text-white mb-6">
            {isEditing ? `Edit Page: ${title}` : "Upload New Coloring Page"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Cute Baby Parrot"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Slug (URL)</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. cute-baby-parrot"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
              <select
                required
                value={categorySlug}
                onChange={(e) => {
                  setCategorySlug(e.target.value);
                  setSubCategorySlug("");
                }}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all appearance-none"
              >
                <option value="">-- Select Category --</option>
                {parentCategories.map(c => (
                  <option key={c.id} value={c.slug}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subcategory (Optional)</label>
              <select
                value={subCategorySlug}
                onChange={(e) => setSubCategorySlug(e.target.value)}
                disabled={!categorySlug}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all disabled:opacity-50 appearance-none"
              >
                <option value="">-- None --</option>
                {subCategories.map(c => (
                  <option key={c.id} value={c.slug}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all appearance-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all appearance-none"
              >
                <option value="kids">Kids</option>
                <option value="adults">Adult</option>
              </select>
            </div>

             <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image (Main JPG/PNG)</label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  {!imageUrl ? (
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${uploadingField === "image" ? "border-purple-500/50 bg-purple-50/10 dark:bg-purple-950/10" : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-950/40 hover:bg-gray-100/50 dark:hover:bg-gray-950/60 hover:border-purple-500/40"}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-8 h-8 mb-2 ${uploadingField === "image" ? "text-purple-500 animate-bounce" : "text-gray-400 dark:text-gray-500"}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                        </svg>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                          {uploadingField === "image" ? "Uploading main image..." : "Click to select or upload image"}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "image")}
                        disabled={uploadingField !== null}
                        className="hidden"
                        required={!imageUrl}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-2xl p-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 flex-shrink-0">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
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
                              onChange={(e) => handleFileUpload(e, "image")}
                              disabled={uploadingField !== null}
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
                placeholder={`e.g. ${title || 'Coloring page'} printable coloring sheet`}
                maxLength={200}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all"
              />
              <p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                📷 Describe the image for search engines and screen readers · Max 200 chars
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Thumbnail Image</label>
                <span className="text-[10px] bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Auto-Generated</span>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  {!thumbnailUrl ? (
                    <div className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-950/40 rounded-2xl">
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 text-center px-4">
                        🪄 Will be auto-generated as WebP when you upload the main image
                      </p>
                      <label className="mt-2 cursor-pointer text-[10px] text-purple-500 font-black uppercase hover:underline flex items-center gap-1">
                        Or upload manually
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "thumbnail")}
                          disabled={uploadingField !== null}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-2xl p-4">
                      <div className="relative w-12 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 flex-shrink-0">
                        <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          {thumbnailUrl.includes("/thumbnails/") ? (
                            <span className="text-[10px] bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">⚡ WebP · Auto</span>
                          ) : (
                            <span className="text-[10px] bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Uploaded</span>
                          )}
                          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 truncate block">{thumbnailUrl.split('/').pop()}</span>
                        </div>
                        <div className="flex gap-2">
                          <label className="cursor-pointer text-[10px] text-purple-600 dark:text-purple-400 font-black uppercase hover:underline flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                            </svg>
                            Override
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, "thumbnail")}
                              disabled={uploadingField !== null}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setThumbnailUrl("")}
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
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description summarizing this coloring page..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tags</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. cute, animals, safari (separated by comma)"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="published"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 bg-gray-50 dark:bg-gray-950/40 cursor-pointer"
              />
              <label htmlFor="published" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                Publish immediately (Visibly online)
              </label>
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
                {isEditing ? "Update Page" : "Upload Page"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Page List & Filters */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
        {/* Filters */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, description..."
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-600 dark:text-gray-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none"
            >
              <option value="">Category</option>
              {parentCategories.map(c => (
                <option key={c.id} value={c.slug}>{c.title}</option>
              ))}
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-600 dark:text-gray-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none"
            >
              <option value="">Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={filterAgeGroup}
              onChange={(e) => setFilterAgeGroup(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-white/5 rounded-xl text-gray-600 dark:text-gray-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none"
            >
              <option value="">Age</option>
              <option value="kids">Kids</option>
              <option value="adults">Adult</option>
            </select>
          </div>

          <button type="submit" className="px-5 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-500 transition-colors shadow-sm">
            Search
          </button>
        </form>

        {/* Table list */}
        {pages.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-semibold text-sm">
            No coloring pages matched your filters.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Preview</th>
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-center">Views</th>
                    <th className="pb-3 text-center">Downloads</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/20 transition-colors">
                      <td className="py-4 pl-2">
                        <img src={page.imageUrl} alt={page.title} className="w-12 h-12 object-cover rounded-xl border border-gray-100 dark:border-white/10" />
                      </td>
                      <td className="py-4 font-extrabold text-[#0F0728] dark:text-white">
                        <div>{page.title}</div>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold block uppercase">Difficulty: {page.difficulty} | Age: {page.ageGroup === 'adults' ? 'adult' : page.ageGroup}</span>
                      </td>
                      <td className="py-4 text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
                        {page.categorySlug}
                        {page.subCategorySlug && <span className="text-gray-400 dark:text-gray-600 block">/ {page.subCategorySlug}</span>}
                      </td>
                      <td className="py-4 text-center font-bold">{page.views.toLocaleString()}</td>
                      <td className="py-4 text-center font-bold">{page.downloads.toLocaleString()}</td>
                      <td className="py-4 text-center">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${page.published ? "bg-green-50 dark:bg-green-950/20 text-green-600" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                          {page.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => handleEdit(page)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-all" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 18.291a8.9 8.9 0 0 1-3.064 1.983L3 20.782l.497-3.078a8.9 8.9 0 0 1 1.984-3.064L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button onClick={() => initiateDelete(page.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
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

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setShowDeleteModal(false);
          setPageToDelete(null);
        }}
      />
    </div>
  );
}
