'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { getImageUrl } from '@/lib';

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

export function ImageViewer({ isOpen, onClose, images, initialIndex = 0 }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const showPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="h-8 w-8" />
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); showPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-50 focus:outline-none"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); showNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-50 focus:outline-none"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

      <div className="relative w-full h-full max-w-7xl max-h-screen p-4 md:p-10 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={getImageUrl(images[currentIndex])}
            alt={`Full screen view ${currentIndex + 1}`}
            fill
            className="object-contain select-none"
            priority
            unoptimized
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/40 text-white/90 text-sm rounded-full backdrop-blur-md">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
