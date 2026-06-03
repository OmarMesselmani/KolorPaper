'use client';

import { useState } from 'react';

export default function DownloadPdf({ imageUrl, title, pdfUrl, slug }: { imageUrl: string, title: string, pdfUrl?: string, slug: string }) {
  const [loading, setLoading] = useState(false);

  const trackDownload = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
    fetch(`${API_URL}/pages/${slug}/download`, { method: 'POST' }).catch(err => console.error("Failed to track download", err));
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      if (pdfUrl) {
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = `${title}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        trackDownload();
        return;
      }

      // 1. Fetch the image to get a blob (using cache: 'reload' to bypass stale CORS cache)
      const response = await fetch(imageUrl, { cache: 'reload' });
      const blob = await response.blob();

      // Convert the blob to a base64 Data URL
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // 2. Load jsPDF dynamically to optimize initial bundle size
      const { jsPDF } = await import('jspdf');

      // Create a temporary dummy doc to read original image properties
      const dummyDoc = new jsPDF();
      const imgProps = dummyDoc.getImageProperties(base64Data);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;

      // Calculate standard physical dimensions in mm based on A4 height (297mm) as reference
      const refSize = 297; // mm
      let pdfWidth = 210;
      let pdfHeight = 297;

      if (imgWidth > imgHeight) {
        // Landscape image
        pdfWidth = refSize;
        pdfHeight = (imgHeight / imgWidth) * refSize;
      } else {
        // Portrait or square image
        pdfHeight = refSize;
        pdfWidth = (imgWidth / imgHeight) * refSize;
      }

      const doc = new jsPDF({
        orientation: imgWidth > imgHeight ? 'l' : 'p',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      // Use the fileType from image properties, or fallback to PNG
      const format = imgProps.fileType || 'PNG';
      doc.addImage(base64Data, format, 0, 0, pdfWidth, pdfHeight);

      // 4. Trigger download directly in browser
      doc.save(`${title}.pdf`);
      trackDownload();
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
      className={`relative group w-14 h-14 flex items-center justify-center bg-gradient-to-tr from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white border-none rounded-2xl shadow-[0_4px_20px_rgba(249,115,22,0.25)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.4)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-95 ${loading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
      aria-label="Download PDF"
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:scale-110"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="M12 18v-6"></path>
          <polyline points="9 15 12 18 15 15"></polyline>
        </svg>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-gray-900/95 backdrop-blur-sm text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl z-10">
        {loading ? 'Generating PDF...' : 'Download PDF'}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
      </div>
    </button>
  );
}
