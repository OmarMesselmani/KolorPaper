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

      // 1. Fetch the image to get a blob (using '?v=1' to bypass stale CORS cache once, but allow subsequent browser caching)
      const response = await fetch(imageUrl + '?v=1');
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
      doc.save(`KolorPaper - ${title}.pdf`);
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
      className={`relative group w-full h-14 flex items-center justify-center bg-gradient-to-tr from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white border-none rounded-2xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-95 select-none ${loading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
      aria-label="Download PDF"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-extrabold text-sm sm:text-base">Generating PDF...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <svg 
            viewBox="0 0 24 24" 
            width="20" 
            height="20" 
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
          <span className="font-extrabold text-sm sm:text-base">Download PDF</span>
        </div>
      )}
    </button>
  );
}
