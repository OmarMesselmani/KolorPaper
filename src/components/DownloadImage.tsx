'use client';

import { useState } from 'react';

export default function DownloadImage({ imageUrl, title }: { imageUrl: string; title: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`bg-purple-600 text-white border-none py-4 px-8 rounded-xl text-lg font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-purple-700'}`}
    >
      <span>🖼️</span> {loading ? 'Loading...' : 'Download Image'}
    </button>
  );
}
