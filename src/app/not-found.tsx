import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[1240px] mx-auto px-6 py-24 text-center">
      <div className="text-[8rem] md:text-[12rem] font-black leading-none bg-gradient-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent mb-4">
        404
      </div>
      <h2 className="text-3xl md:text-4xl font-black text-[#0F0728] mb-4">
        Page Not Found
      </h2>
      <p className="text-lg text-gray-500 max-w-lg mx-auto mb-10">
        The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to coloring!
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-gradient-to-br from-purple-600 to-orange-500 text-white font-bold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity shadow-lg"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
