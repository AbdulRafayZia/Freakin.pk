"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// --- Video helpers (from Sliders.jsx) ---
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v"];
const isVideoUrl = (url = "") => {
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
};
// For this context, we only have URLs, not product objects, so just return url/type
const resolveMedia = (url) => {
  return {
    url,
    type: isVideoUrl(url) ? "video" : "image",
    posterUrl: undefined,
  };
};

export default function Photos({ imageList = [] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const containerRef = useRef(null);
  const videoRefs = useRef({}); // {idx: HTMLVideoElement}

  if (!imageList || imageList.length === 0) return null;

  const previousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1
    );
  };



  const selectedItem = imageList[selectedImageIndex];
  const selectedMedia = resolveMedia(selectedItem);

  // --- Video autoplay/pause logic like Sliders.jsx ---
  useEffect(() => {
    // Pause all videos except the selected one
    imageList.forEach((item, idx) => {
      const ref = videoRefs.current[idx];
      if (!ref) return;
      if (idx === selectedImageIndex) {
        ref.play?.().catch(() => { });
      } else {
        ref.pause?.();
        ref.currentTime = 0;
      }
    });
  }, [selectedImageIndex, imageList]);

  // Autoplay the first video on mount if it's a video
  useEffect(() => {
    if (selectedMedia.type === "video") {
      videoRefs.current[selectedImageIndex]?.play?.().catch(() => { });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageList]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Main viewer */}
      <div className="flex justify-center w-full relative items-center">
        {imageList.length > 1 && (
          <button
            onClick={previousImage}
            className="absolute top-1/2 left-5 -translate-y-1/2 z-10 h-9 w-9 grid place-items-center rounded-full bg-white/90 border shadow hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft />
          </button>
        )}

        <div
          ref={containerRef}
          className="flex justify-center w-full relative items-center overflow-hidden rounded-lg"
          // Keyboard support for left/right on the main media
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") previousImage();
          }}
        >
          {selectedMedia.type === "video" ? (
            <video
              ref={el => (videoRefs.current[selectedImageIndex] = el)}
              className="object-cover h-[350px] md:h-[430px] bg-black w-full"
              src={selectedMedia.url}
              poster={selectedMedia.posterUrl}
              controls
              playsInline
              muted
              loop
              autoPlay
              preload="metadata"
            />
          ) : (
            <>
              <div
                className="w-full h-[350px] md:h-[500px] relative bg-white rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center"
              >
                <Image
                  src={selectedMedia.url}
                  alt="Product media"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 600px"
                  priority
                />
              </div>
            </>
          )}
        </div>

        {imageList.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute top-1/2 right-5 -translate-y-1/2 z-10 h-9 w-9 grid place-items-center rounded-full bg-white/90 border shadow hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight />
          </button>
        )}
      </div>

      {/* Thumbnails rail (no Swiper) */}
      <ThumbsRail
        imageList={imageList}
        selectedImageIndex={selectedImageIndex}
        setSelectedImageIndex={setSelectedImageIndex}
        videoRefs={videoRefs}
      />
    </div>
  );
}

/* ---------------- Thumbnails rail (scroll-snap, arrows, keyboard) ---------------- */
function ThumbsRail({ imageList, selectedImageIndex, setSelectedImageIndex, videoRefs }) {
  const railRef = useRef(null);

  const scrollThumbIntoView = useCallback((idx) => {
    const rail = railRef.current;
    if (!rail) return;
    const el = rail.querySelector(`[data-thumb="${idx}"]`);
    if (el) el.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollThumbIntoView(selectedImageIndex);
  }, [selectedImageIndex, scrollThumbIntoView]);

  // Horizontal wheel scrolling but let page scroll at edges
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (!(Math.abs(e.deltaY) > Math.abs(e.deltaX)) || e.shiftKey) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= max - 1;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      el.scrollBy({ left: e.deltaY * 0.9, behavior: "smooth" });
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => el.removeEventListener("wheel", onWheel, { capture: true });
  }, []);

  const stepScroll = (dir = 1) => {
    const el = railRef.current;
    if (!el) return;
    const thumb = el.querySelector("[data-thumb]");
    const gap = 8; // matches gap-2
    const w = thumb ? thumb.getBoundingClientRect().width + gap : el.clientWidth * 0.9;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  const moveSelection = (dir) => {
    const next = Math.max(0, Math.min(imageList.length - 1, selectedImageIndex + dir));
    setSelectedImageIndex(next);
  };

  return (
    <div className="relative select-none mt-1">
      {/* edge masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />

      {/* rail */}
      <div
        ref={railRef}
        role="listbox"
        aria-label="Product thumbnails"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") moveSelection(1);
          if (e.key === "ArrowLeft") moveSelection(-1);
        }}
        className="
          flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2
          [scrollbar-width:none] [-ms-overflow-style:none]
          focus:outline-none focus:ring-2 focus:ring-black/5
        "
        style={{ scrollbarWidth: "none" }}
      >
        <style>{`.thumbs::-webkit-scrollbar{display:none}`}</style>

        {imageList.map((item, index) => {
          const media = resolveMedia(item);
          const selected = index === selectedImageIndex;

          return (
            <button
              key={index}
              type="button"
              data-thumb={index}
              role="option"
              aria-selected={selected}
              onClick={() => setSelectedImageIndex(index)}
              className={`snap-start shrink-0 border rounded-md p-1 bg-white transition
                ${selected ? "border-black" : "border-zinc-300 hover:border-zinc-400"}`}
              style={{ width: 90, height: 70 }}
              title={`Thumbnail ${index + 1}`}
            >
              {media.type === "video" ? (
                <div className="relative w-full h-full bg-black rounded">
                  <video
                    ref={el => (videoRefs?.current ? (videoRefs.current[index] = el) : undefined)}
                    src={media.url}
                    className="w-full h-full object-cover rounded"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 py-[1px] rounded">
                    ▶
                  </span>
                </div>
              ) : (
                <div className="w-full h-full relative rounded">
                  <Image
                    src={media.url}
                    alt=""
                    fill={false}
                    width={90}
                    height={70}
                    className="w-full h-full object-cover rounded"
                    loading="lazy"
                    sizes="90px"
                    draggable={false}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* arrows (sm and up) */}
      <button
        type="button"
        aria-label="Scroll thumbnails left"
        onClick={() => stepScroll(-1)}
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border bg-white shadow"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        aria-label="Scroll thumbnails right"
        onClick={() => stepScroll(1)}
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border bg-white shadow"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
