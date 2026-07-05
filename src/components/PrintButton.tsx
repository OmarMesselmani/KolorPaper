'use client';

interface PrintButtonProps {
  slug: string;
  imageUrl: string;
  title: string;
}

export default function PrintButton({ slug, imageUrl, title }: PrintButtonProps) {
  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if we already have a print container
    let printContainer = document.getElementById('print-container');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'print-container';
      document.body.appendChild(printContainer);
      
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body > *:not(#print-container) {
            display: none !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
          }
          #print-container {
            display: flex !important;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100vh;
          }
          #print-container img {
            max-width: 100%;
            max-height: 100vh;
            object-fit: contain;
          }
          @page { margin: 0; size: auto; }
        }
        @media screen {
          #print-container {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    printContainer.innerHTML = `<img src="${imageUrl}" />`;

    const img = printContainer.querySelector('img');
    if (img) {
      img.onload = () => {
        window.print();
      };
      // Fallback
      setTimeout(() => {
        if (!img.complete) window.print();
      }, 500);
    } else {
      window.print();
    }

    // Track print as download
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
    fetch(`${API_URL}/pages/${slug}/download`, { method: 'POST' }).catch(err => console.error("Failed to track print download", err));
  };

  return (
    <button 
      onClick={handlePrint} 
      className="relative group w-full h-14 flex items-center justify-center bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-none rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-95 select-none" 
      aria-label="Print Page"
    >
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
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        <span className="font-semibold text-sm sm:text-base">Print</span>
      </div>
    </button>
  );
}
