'use client';

import { useState } from 'react';

export default function DownloadPdf({ imageUrl, title }: { imageUrl: string, title: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // سنقوم باستدعاء الـ API الذي سننشئه لاحقاً
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, title }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
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
      className="btn-secondary" 
      style={{
        background: 'var(--secondary)', 
        color: 'white', 
        border: 'none', 
        padding: '1rem 2rem', 
        borderRadius: '10px', 
        cursor: loading ? 'not-allowed' : 'pointer', 
        fontSize: '1.1rem', 
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: loading ? 0.7 : 1
      }}
    >
      <span>📥</span> {loading ? 'جاري التحضير...' : 'تحميل PDF'}
    </button>
  );
}
