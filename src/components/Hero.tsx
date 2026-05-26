import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="w-full text-center mb-12">
      <div className="w-full">
        <Image
          src="/images/cover.jpg"
          alt="KolorPaper Cover"
          width={1440}
          height={600}
          className="w-full h-auto block"
          priority
        />
      </div>
      <div className="w-full px-6 py-10 flex flex-col items-center justify-center leading-relaxed">
        <h2 className="text-4xl md:text-[4rem] font-black bg-gradient-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent mb-4 tracking-tight pb-3">Print, color, smile.</h2>
        <p className="text-lg md:text-2xl text-gray-500 dark:text-gray-400 max-w-4xl mx-auto m-0 font-semibold">Explore thousands of printable coloring pages for kids and families.</p>
      </div>
    </section>
  );
};

export default Hero;
