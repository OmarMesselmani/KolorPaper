'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ImageProtector from '@/components/ImageProtector';

interface ColoringImagePreviewProps {
  imageUrl: string;
  thumbnailUrl?: string;
  alt: string;
  title: string;
}

export default function ColoringImagePreview({
  imageUrl,
  thumbnailUrl,
  alt,
  title,
}: ColoringImagePreviewProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(imageUrl);
  const [hasError, setHasError] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  // If the primary high-res image fails (e.g. Cloudflare 429 rate limit or network glitch),
  // immediately fallback to thumbnailUrl so the user never sees a broken image icon.
  const handleError = () => {
    if (thumbnailUrl && currentSrc !== thumbnailUrl) {
      console.warn(`[ColoringImagePreview] Failed to load ${currentSrc}, falling back to thumbnail`);
      setCurrentSrc(thumbnailUrl);
      setHasError(true);
    }
  };

  // Background retry: silently retry fetching the high-res image with exponential backoff
  useEffect(() => {
    if (!hasError || retryAttempt >= 4) return;

    const timer = setTimeout(() => {
      const nextAttempt = retryAttempt + 1;
      const retryUrl = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}retry=${nextAttempt}`;
      
      const testImg = new window.Image();
      testImg.src = retryUrl;

      testImg.onload = () => {
        // High-res image loaded successfully! Upgrade back smoothly
        setCurrentSrc(retryUrl);
        setHasError(false);
      };

      testImg.onerror = () => {
        setRetryAttempt(nextAttempt);
      };
    }, 2000 * Math.pow(1.5, retryAttempt));

    return () => clearTimeout(timer);
  }, [hasError, retryAttempt, imageUrl]);

  return (
    <div
      className="relative w-full h-auto overflow-hidden rounded-3xl bg-contain bg-center bg-no-repeat"
      style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : undefined}
    >
      <ImageProtector>
        <Image
          src={currentSrc}
          alt={alt}
          width={450}
          height={600}
          className="w-full h-auto block print:hidden pointer-events-none select-none transition-opacity duration-300"
          priority
          draggable={false}
          onError={handleError}
        />
      </ImageProtector>
    </div>
  );
}
