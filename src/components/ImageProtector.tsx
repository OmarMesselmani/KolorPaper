'use client';

import React from 'react';

interface ImageProtectorProps {
  children: React.ReactNode;
  className?: string;
}

export default function ImageProtector({ children, className = '' }: ImageProtectorProps) {
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className={`relative select-none ${className}`}
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {children}
      {/* Transparent protection shield */}
      <div
        className="absolute inset-0 z-10 select-none cursor-default"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        aria-hidden="true"
      />
    </div>
  );
}
