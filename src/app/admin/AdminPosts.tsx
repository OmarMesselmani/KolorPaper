'use client';

import { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { getErrorMessage } from "@/lib/error";

interface AdminPostsProps {
  token: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  coverImage: string;
  content: string;
  published: boolean;
}

export default function AdminPosts({ token }: AdminPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("KolorPaper Team");
  const [category, setCategory] = useState("General");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/posts`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to load blog posts.");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Something went wrong."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
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
            fileName: file.name,
            fileType: "image",
            base64Data,
            thumbBase64Data
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setCoverImage(data.url);
        setSuccess(`Cover image "${file.name}" uploaded successfully!`);
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
    setDate("");
    setAuthor("KolorPaper Team");
    setCategory("General");
    setExcerpt("");
    setCoverImage("");
    setContent("");
    setPublished(true);
    setIsEditing(false);
    setEditId("");
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    const payload = {
      title,
      slug,
      date: date || new Date().toISOString().split("T")[0],
      author,
      category,
      excerpt,
      coverImage,
      content,
      published
    };

    try {
      const url = isEditing 
        ? `${API_URL}/admin/posts/${editId}` 
        : `${API_URL}/admin/posts`;
      
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
        throw new Error(data.error || `Failed to ${isEditing ? "update" : "create"} blog post.`);
      }

      setSuccess(`Blog post successfully ${isEditing ? "updated" : "created"}!`);
      resetForm();
      fetchPosts();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to submit post."));
    }
  };

  const handleEdit = (post: BlogPost) => {
    setIsEditing(true);
    setEditId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setDate(post.date);
    setAuthor(post.author);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setCoverImage(post.coverImage);
    setContent(post.content);
    setPublished(post.published);
    setShowForm(true);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const initiateDelete = (id: string) => {
    setPostToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    const id = postToDelete;

    setShowDeleteModal(false);
    setPostToDelete(null);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete post.");
      }

      setSuccess("Blog post deleted successfully.");
      fetchPosts();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete post."));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Blog Posts</h1>
          <p className="text-gray-400 text-xs mt-1">Manage articles, writing tips, and cover images on the site.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/10 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Post
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-950/20 border border-green-500/20 text-green-400 rounded-2xl text-xs font-semibold">
          {success}
        </div>
      )}

      {/* Post Editor Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0F0728] border border-white/5 rounded-3xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-purple-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            {isEditing ? "Edit Article" : "Create New Article"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="How to choose colors..."
                className="w-full px-4 py-3 bg-[#070216] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Slug (URL friendly) *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="how-to-choose-colors"
                className="w-full px-4 py-3 bg-[#070216] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#070216] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="KolorPaper Team"
                className="w-full px-4 py-3 bg-[#070216] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Art / Tips / Guide"
                className="w-full px-4 py-3 bg-[#070216] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Published Status */}
            <div className="space-y-2 flex flex-col justify-center">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Publish Status</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white"></div>
                <span className="ms-3 text-xs font-extrabold text-gray-400">{published ? "Published" : "Draft (Unpublished)"}</span>
              </label>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Excerpt (Short Description) *</label>
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Provide a brief summary of the article..."
              className="w-full px-4 py-3 bg-[#070216] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-purple-500 transition-colors resize-y"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Cover Image *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="URL to cover image..."
                  className="w-full px-4 py-3 bg-[#070216] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white rounded-xl cursor-pointer transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <span>{uploading ? "Uploading..." : "Upload Cover Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              {/* Cover Image Preview */}
              <div className="h-32 border border-white/5 rounded-2xl bg-[#070216] overflow-hidden flex items-center justify-center relative group">
                {coverImage ? (
                  <>
                    <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-extrabold text-xs transition-opacity cursor-pointer"
                    >
                      Remove Cover
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500 text-xs">Image preview will show here</span>
                )}
              </div>
            </div>
          </div>

          {/* Content Markdown Area */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Content (Supports Markdown) *</label>
              <span className="text-[10px] text-gray-500">Supports standard markdown formatting (# Headers, *bold*, etc.)</span>
            </div>
            <textarea
              required
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article in markdown here..."
              className="w-full px-4 py-4 bg-[#070216] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-purple-500 transition-colors font-mono resize-y"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-purple-600/10"
            >
              {isEditing ? "Save Changes" : "Publish Post"}
            </button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-[#0F0728] border border-white/5 rounded-3xl">
          <p className="text-gray-400 text-sm">No blog posts found. Click &quot;Add New Post&quot; to write your first article!</p>
        </div>
      ) : (
        /* Blog Posts Table / Card List */
        <div className="bg-[#0F0728] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-gray-400 uppercase tracking-wider font-extrabold bg-black/10">
                  <th className="py-4 px-6">Post Details</th>
                  <th className="py-4 px-6">Slug / Category</th>
                  <th className="py-4 px-6">Author & Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.01] transition-colors">
                    {/* Title + Excerpt + Cover thumbnail */}
                    <td className="py-4 px-6 max-w-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-900 border border-white/5 flex-shrink-0">
                          {post.coverImage ? (
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600 bg-gray-950">No Cover</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="block font-bold text-white truncate hover:text-purple-400 transition-colors" title={post.title}>
                            {post.title}
                          </span>
                          <span className="block text-[10px] text-gray-400 truncate mt-0.5" title={post.excerpt}>
                            {post.excerpt || "No summary provided."}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Slug / Category */}
                    <td className="py-4 px-6">
                      <span className="block text-gray-300 font-mono text-[10px] select-all">/{post.slug}</span>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-purple-950/40 text-purple-400 border border-purple-800/20 text-[9px] font-semibold mt-1">
                        {post.category}
                      </span>
                    </td>

                    {/* Author & Date */}
                    <td className="py-4 px-6">
                      <span className="block text-gray-300 font-medium">{post.author}</span>
                      <span className="block text-[10px] text-gray-500 mt-0.5">{post.date}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-green-500/10 text-green-400 border border-green-500/20">
                          <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 bg-white/5 hover:bg-white/10 hover:text-purple-400 border border-white/10 rounded-xl text-gray-400 transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button
                        onClick={() => initiateDelete(post.id)}
                        className="p-2 bg-white/5 hover:bg-red-950/20 hover:text-red-400 border border-white/10 rounded-xl text-gray-400 transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setShowDeleteModal(false);
          setPostToDelete(null);
        }}
        title="تأكيد الحذف"
        message="هل ترغب في حذف هذا المقال نهائياً؟"
      />
    </div>
  );
}
