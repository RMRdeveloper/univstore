'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib';

interface UseImageUploadProps {
  images: (string | File)[];
  maxImages: number;
  onImagesChange: (images: (string | File)[]) => void;
}

export function useImageUpload({ images, maxImages, onImagesChange }: UseImageUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const addFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar 5MB');
      return;
    }

    if (images.length >= maxImages) {
      setError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    setError(null);

    // Fix for clipboard files
    const cleanFile = new File([file], file.name === 'image.png' ? `pasted-image-${Date.now()}.png` : file.name, {
      type: file.type,
      lastModified: Date.now(),
    });

    onImagesChange([...images, cleanFile]);
  }, [images, maxImages, onImagesChange]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    addFile(file);
  }, [addFile]);

  return {
    error,
    handleFiles
  };
}
