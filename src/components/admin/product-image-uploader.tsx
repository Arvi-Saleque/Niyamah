"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageUploaderProps {
  value: string[]; // existing URLs
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

/**
 * Product image upload widget for admin.
 * Accepts local file previews (FileReader) and emits sorted URL arrays.
 * Actual upload to Cloudinary is wired externally via onChange when files are ready.
 */
export function ProductImageUploader({
  value,
  onChange,
  maxImages = 8,
  className,
}: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>(value);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = maxImages - previews.length;
    const toAdd = Array.from(files).slice(0, remaining);
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setPreviews((prev) => {
          const next = [...prev, url];
          onChange(next);
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const remove = (i: number) => {
    const next = previews.filter((_, idx) => idx !== i);
    setPreviews(next);
    onChange(next);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-4 gap-2">
        {previews.map((url, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--color-border)]">
            <Image src={url} alt={`product image ${i + 1}`} fill sizes="120px" className="object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {previews.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <Upload className="h-5 w-5" />
            <span className="text-xs">Upload</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-[var(--color-text-muted)]">{previews.length}/{maxImages} images</p>
    </div>
  );
}
