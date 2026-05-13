import { useState, useEffect, useCallback } from "react";

interface GalleryImage {
  src: string;
  caption: string;
}

interface Props {
  images: GalleryImage[];
}

export default function CakeGallery({ images }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openLightbox = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setOpen(false);
  }, []);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, closeLightbox, goNext, goPrev]);

  if (!images.length) return null;

  return (
    <div class="gallery-masonry">
      {images.map((image, i) => (
        <div class="gallery-item">
          <div
            class="glass rounded-lg p-3 cursor-pointer"
            onClick={() => openLightbox(i)}
          >
            <img
              src={image.src}
              alt={image.caption}
              class="w-full rounded"
              loading="lazy"
            />
          </div>
          {image.caption && (
            <div class="mt-2 text-center text-sm glass px-3 py-2 rounded-lg">
              {image.caption}
            </div>
          )}
        </div>
      ))}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="max-h-[85vh] max-w-[90vw] p-4">
            <img
              src={images[index].src}
              alt={images[index].caption}
              className="max-h-[80vh] max-w-full rounded object-contain"
            />
            {images[index].caption && (
              <p className="mt-2 text-center text-sm text-white/70">{images[index].caption}</p>
            )}
          </div>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50">
            {index + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
