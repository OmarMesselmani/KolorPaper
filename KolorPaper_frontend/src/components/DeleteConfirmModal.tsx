'use client';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onConfirm,
  onClose,
  title = "تأكيد الحذف",
  message = "هل ترغب في حذف هذه الصورة نهائياً؟"
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Warning Icon Container */}
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        
        {/* Modal Heading & Text */}
        <h4 className="text-lg font-black text-[#0F0728] dark:text-white mb-2 font-sans">
          {title}
        </h4>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6 font-sans">
          {message}
        </p>

        {/* Actions */}
        <div className="flex w-full gap-3 font-sans">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl text-xs transition-colors shadow-md uppercase tracking-wider"
          >
            نعم
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors uppercase tracking-wider"
          >
            لا
          </button>
        </div>
      </div>
    </div>
  );
}
