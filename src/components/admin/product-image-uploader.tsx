"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageUploaderProps {
  value: string[]; // existing Cloudinary URLs
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

/** Uploads each file to /api/v1/admin/media/upload (Cloudinary), then emits the returned URLs. */
export function ProductImageUploader({
  value,
  onChange,
  maxImages = 8,
  className,
}: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = maxImages - value.length;
    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of toUpload) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/v1/admin/media/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error("Upload failed:", err);
          continue;
        }
        const json = await res.json();
        const url: string = json?.data?.url ?? json?.url;
        if (url) uploaded.push(url);
      } catch (e) {
        console.error("Upload error:", e);
      }
    }
    setUploading(false);
    if (uploaded.length > 0) onChange([...value, ...uploaded]);
    // Reset input so the same file can be re-selected if needed
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (i: number) => {
    onChange(value.filter((_, idx) => idx !== i));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-4 gap-2">
        {value.map((url, i) => (
          <div
            key={url + i}
            className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--color-border)]"
          >
            <Image src={url} alt={`product image ${i + 1}`} fill sizes="120px" className="object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 py-0.5 text-[10px] font-medium text-white">
                Primary
              </span>
            )}
          </div>
        ))}

        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => !uploading && inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
            <span className="text-xs">{uploading ? "Uploading…" : "Upload"}</span>
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
      <p className="text-xs text-[var(--color-text-muted)]">
        {value.length}/{maxImages} images · First image is primary · Max 8 MB each
      </p>
    </div>
  );
}
