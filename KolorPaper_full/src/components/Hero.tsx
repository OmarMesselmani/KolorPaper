import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="w-full text-center mb-12">
      <div className="relative w-full overflow-hidden h-[260px] sm:h-auto sm:aspect-[1542/592]">
        <Image
          src="/images/cover.jpg"
          alt="Free printable coloring pages for kids and adults - KolorPaper"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Layer above the image and behind the text with a gradient from #f9fafb to transparent covering the bottom half */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#f9fafb] via-[#f9fafb]/80 to-transparent dark:from-gray-950 dark:via-gray-950/80 pointer-events-none" />
        
        {/* Text bottom-centered */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-4 sm:pb-10 md:pb-14 flex flex-col items-center justify-end h-full z-10 pointer-events-none">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] font-black bg-gradient-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent mb-1 md:mb-3 tracking-tight pb-1 select-text pointer-events-auto leading-tight">
            Print, color, smile.
          </h1>
          <p className="text-xs sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto m-0 font-bold select-text pointer-events-auto leading-relaxed">
            Explore thousands of printable coloring pages for kids and families.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
