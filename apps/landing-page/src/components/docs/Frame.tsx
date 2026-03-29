/** @jsxImportSource react */
import React from 'react';

interface FrameProps {
  src: string;
  alt?: string;
  caption?: string;
}

export default function Frame({ src, alt, caption }: FrameProps) {
  return (
    <div className="my-8">
      <div className="transition-hover overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm hover:border-indigo-200 hover:shadow-md">
        <img
          src={src}
          alt={alt || caption || 'Documentation screenshot'}
          className="block h-auto w-full"
          loading="lazy"
        />
      </div>
      {caption && (
        <p className="mt-3 text-center text-sm text-slate-500 italic">
          {caption}
        </p>
      )}
    </div>
  );
}
