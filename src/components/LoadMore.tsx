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
        className="px-8 py-3 bg-gradient-to-br from-purple-600 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 cursor-pointer border-none"
      >
        {label}
      </button>
    </div>
  );
}
