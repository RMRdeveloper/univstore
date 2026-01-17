'use client';

import { useState, type KeyboardEvent, type ChangeEvent } from 'react';
import { X, Tag } from 'lucide-react';
import { cn } from '@/lib';

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagsInput({ value = [], onChange, placeholder, className }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim().replace(/,/g, '');
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleBlur = () => {
    addTag();
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap gap-2 p-2 border border-input rounded-xl bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all min-h-[46px]">
        {value.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg border border-indigo-100 animate-in zoom-in duration-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-indigo-400 hover:text-indigo-900 focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <div className="relative flex-1 min-w-[120px]">
          {!value.length && !inputValue && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <Tag className="w-4 h-4 inline mr-2" />
              <span className="text-sm">{placeholder}</span>
            </div>
          )}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full h-full p-1 bg-transparent border-none focus:outline-none text-sm text-foreground placeholder:text-transparent"
            placeholder={value.length > 0 ? "" : placeholder} // Native placeholder as fallback or if clear
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 ml-1">
        Escribe y presiona Enter o coma (,) para agregar.
      </p>
    </div>
  );
}
