/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';

interface FrameProps {
  src: string;
  alt?: string;
  caption?: string;
}
const CDN_URL = 'https://assets.refearnapp.com';
export default function Frame({ src, alt, caption }: FrameProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const fullSrc = src.startsWith('/') ? `${CDN_URL}${src}` : src;
  // Sync animation state with open state
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for the duration of the animation (200ms) before unmounting
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <>
      <div className="my-8">
        <div
          onClick={() => setIsOpen(true)}
          className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
        >
          <div className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-1.5 text-slate-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            <Maximize2 size={16} />
          </div>

          <img
            src={fullSrc}
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
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm transition-all duration-200 ease-out ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        >
          <button
            className="absolute top-6 right-6 text-white/70 transition-colors hover:text-white"
            onClick={handleClose}
          >
            <X size={32} />
          </button>

          <img
            src={src}
            alt={alt || caption}
            className={`max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl transition-all duration-200 ease-out ${
              isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          />

          {caption && (
            <div
              className={`absolute right-0 bottom-10 left-0 text-center transition-all duration-300 ${
                isAnimating
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
            >
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
