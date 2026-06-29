'use client';

interface LoadMoreProps {
  onClick: () => void;
  label?: string;
}

export default function LoadMore({ onClick, label = "See More" }: LoadMoreProps) {
  return (
    <div className="mt-4 flex justify-center pb-16">
      <button
        onClick={onClick}
        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_auto] text-white px-7 py-3 rounded-full font-bold text-base shadow-sm hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 hover:bg-[position:right_center] transition-all duration-500 cursor-pointer border-none"
      >
        {label}
      </button>
    </div>
  );
}
