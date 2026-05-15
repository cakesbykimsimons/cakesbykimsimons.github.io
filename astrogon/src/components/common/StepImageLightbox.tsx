import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

export default function StepImageLightbox({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [imageSources, setImageSources] = useState<
    { src: string; alt: string; stepText: string }[]
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items =
      containerRef.current.querySelectorAll<HTMLDivElement>(
        ".step-image-inline",
      );
    const collected: { src: string; alt: string; stepText: string }[] = [];
    items.forEach((el) => {
      const img = el.querySelector("img");
      const li = el.closest("li");
      const stepText = li
        ? Array.from(li.childNodes)
            .filter(
              (n) =>
                n.nodeType === Node.TEXT_NODE &&
                n.textContent?.trim().length > 0,
            )
            .map((n) => n.textContent?.trim())
            .join(" ")
        : "";
      collected.push({
        src: img?.src || "",
        alt: el.dataset.alt || "",
        stepText,
      });
    });
    setImageSources(collected);

    const handlers: (() => void)[] = [];
    items.forEach((el, i) => {
      el.style.cursor = "pointer";
      const clickHandler = () => {
        setIndex(i);
        setOpen(true);
      };
      el.addEventListener("click", clickHandler);
      handlers.push(() => el.removeEventListener("click", clickHandler));
    });
    return () => {
      handlers.forEach((fn) => fn());
    };
  }, []);

  const closeLightbox = useCallback(() => setOpen(false), []);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % imageSources.length);
  }, [imageSources.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + imageSources.length) % imageSources.length);
  }, [imageSources.length]);

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

  return (
    <>
      <div ref={containerRef} className="step-image-lightbox">
        {children}
      </div>

      {open &&
        imageSources.length > 0 &&
        typeof document !== "undefined" &&
        createPortal(
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="max-h-[85vh] max-w-[90vw] p-4">
              <img
                src={imageSources[index].src}
                alt={imageSources[index].alt}
                className="max-h-[80vh] max-w-full rounded object-contain"
              />
              {imageSources[index].stepText && (
                <p className="mt-1 text-center text-sm text-white/70">
                  {imageSources[index].stepText}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50">
              {index + 1} / {imageSources.length}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
