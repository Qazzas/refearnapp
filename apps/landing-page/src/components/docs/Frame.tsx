/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';

interface FrameProps {
  src: string;
  alt?: string;
  caption?: string;
}

export default function Frame({ src, alt, caption }: FrameProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <div className="my-8">
        <div
          onClick={() => setIsOpen(true)}
          className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
        >
          {/* Zoom Hint Icon */}
          <div className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-1.5 text-slate-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            <Maximize2 size={16} />
          </div>

          <img
            src={src}
            alt={alt || caption || 'Documentation screenshot'}
            className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
          />
        </div>
        {caption && (
          <p className="mt-3 text-center text-sm text-slate-500 italic">
            {caption}
          </p>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm duration-200"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={32} />
          </button>

          <img
            src={src}
            alt={alt || caption}
            className="animate-in zoom-in-95 max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl duration-300"
          />

          {caption && (
            <div className="absolute right-0 bottom-10 left-0 text-center">
              <span className="rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-md">
                {caption}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
