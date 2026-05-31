'use client';

interface PrintButtonProps {
  slug: string;
  imageUrl: string;
  title: string;
}

export default function PrintButton({ slug, imageUrl, title }: PrintButtonProps) {
  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Create a hidden iframe to print the full-size image only
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>Print Coloring Page - ${title}</title>
            <style>
              @page { margin: 0; }
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: white; }
              img { max-width: 100%; max-height: 100%; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" onload="window.print(); setTimeout(() => { window.parent.document.body.removeChild(window.frameElement); }, 100);" />
          </body>
        </html>
      `);
      doc.close();
    }

    // Track print as download
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    fetch(`${API_URL}/pages/${slug}/download`, { method: 'POST' }).catch(err => console.error("Failed to track print download", err));
  };

  return (
    <button 
      onClick={handlePrint} 
      className="relative group w-14 h-14 flex items-center justify-center bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-none rounded-2xl cursor-pointer shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.4)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-95" 
      aria-label="Print Page"
    >
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
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-gray-900/95 backdrop-blur-sm text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl z-10">
        Print Coloring Page
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
      </div>
    </button>
  );
}
