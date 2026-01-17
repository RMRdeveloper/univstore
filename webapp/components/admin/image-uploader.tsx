'use client';

import { useState, useRef, useEffect, type DragEvent, type ClipboardEvent } from 'react';
import Image from 'next/image';
import { X, ImagePlus } from 'lucide-react';
import { getImageUrl, cn } from '@/lib';
import { useImageUpload } from './use-image-upload';

interface ImageUploaderProps {
  images: (string | File)[];
  onImagesChange: (images: (string | File)[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onImagesChange, maxImages = 6 }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const { error, handleFiles } = useImageUpload({
    images,
    maxImages,
    onImagesChange
  });

  const getPreviewUrl = (image: string | File) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return getImageUrl(image);
  };

  // Drag & Drop Handlers
  const handleDrag = (e: DragEvent<HTMLDivElement>, isOver: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isOver);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // Paste Logic (Consolidated)
  const processPaste = (items: DataTransferItemList | undefined) => {
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const dt = new DataTransfer();
          dt.items.add(file);
          handleFiles(dt.files);
        }
        break;
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    processPaste(e.clipboardData?.items);
  };

  useEffect(() => {
    const handleGlobalPaste = (e: globalThis.ClipboardEvent) => {
      // Ignore if pasting into an input/textarea
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      processPaste(e.clipboardData?.items);
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [handleFiles]); // Re-bind if handleFiles changes

  const removeImage = (indexToRemove: number) => {
    onImagesChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Imágenes del producto
      </label>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group shadow-sm"
          >
            <Image
              src={getPreviewUrl(image)}
              alt={`Imagen ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:text-red-500 scale-90 hover:scale-100"
            >
              <X className="h-4 w-4" />
            </button>

            {index === 0 && (
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-indigo-600 text-white text-xs font-medium rounded-full shadow-sm">
                Principal
              </span>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <div
            ref={dropZoneRef}
            tabIndex={0}
            onDrop={handleDrop}
            onDragOver={(e) => handleDrag(e, true)}
            onDragLeave={(e) => handleDrag(e, false)}
            onPaste={handlePaste}
            className={cn(
              'relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
              isDragging
                ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            )}
          >
            {/* Uploading UI removed */}
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2 pointer-events-none p-4 text-center">
                <div className="p-3 bg-slate-100 rounded-full group-hover:bg-indigo-50 transition-colors">
                  <ImagePlus className="h-6 w-6 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">
                    {isDragging ? '¡Suelta aquí!' : 'Agregar imagen'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Click, arrastrar o pegar
                  </p>
                </div>
              </div>
            </>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 flex justify-between">
        <span>Formatos: JPG, PNG, WebP</span>
        <span>{images.length}/{maxImages}</span>
      </p>
    </div>
  );
}
