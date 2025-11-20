"use client";

import { useRef, useState, useEffect } from "react";

// Video extension check (copied from other components)
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v"];
const isVideoUrl = (url = "") => {
  const clean = url?.split("?")[0].split("#")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
};

export default function ImageGallery({ images, aspectRatio = 16 / 9 }) {
  const [expanded, setExpanded] = useState(false);
  const [galleryHeight, setGalleryHeight] = useState(0);
  const galleryRef = useRef(null);

  // Store refs to all video elements
  const videoRefs = useRef([]);

  function calculateMediaHeight(mediaUrl, screenWidth, callback) {
    if (isVideoUrl(mediaUrl)) {
      // For videos, use aspectRatio or fallback to 16/9
      const calculatedHeight = screenWidth / aspectRatio;
      callback(calculatedHeight);
    } else {
      const img = new Image();
      img.src = mediaUrl;

      img.onload = function () {
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;

        const calculatedHeight = (originalHeight / originalWidth) * screenWidth;

        callback(calculatedHeight);
      };

      img.onerror = function () {
        console.error("Failed to load image:", mediaUrl);
      };
    }
  }

  const calculateHeight = (images) => {
    const screenWidth = window.innerWidth;
    let totalHeight = 0;
    let loadedCount = 0;

    if (!images?.length) {
      setGalleryHeight(0);
      return;
    }

    images.forEach((mediaUrl, idx) => {
      calculateMediaHeight(mediaUrl, screenWidth, (h) => {
        totalHeight += h;
        loadedCount += 1;
        if (loadedCount === images.length) {
          setGalleryHeight(totalHeight);
        }
      });
    });
  };

  // Recalculate height on window resize
  useEffect(() => {
    calculateHeight(images);
    const handleResize = () => calculateHeight(images);
    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener("resize", handleResize);
  }, [images]);

  // Play all videos when expanded becomes true
  useEffect(() => {
    if (expanded) {
      // Play all videos in the gallery
      videoRefs.current.forEach((video) => {
        if (video) {
          // Try to play, ignore errors (e.g., if already playing)
          video.play?.().catch(() => {});
        }
      });
    }
  }, [expanded]);

  const toggleExpanded = () => {
    if (expanded) {
      galleryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setExpanded((prev) => !prev);
  };

  return (
    <div className={`relative w-full ${expanded ? "mb-24" : "mb-4"}`}>
      {/* Media container with smooth height transition */}
      <div
        ref={galleryRef}
        className={`overflow-hidden transition-all ease-in-out ${
          expanded ? `max-h-[${galleryHeight}px]` : "max-h-[50vh]"
        }`}
        style={{
          maxHeight: expanded ? galleryHeight + "px" : "380px",
          transitionDuration: images.length + 1000 + "ms",
        }}
      >
        {images.map((media, index) =>
          isVideoUrl(media) ? (
            <video
              key={index}
              ref={el => (videoRefs.current[index] = el)}
              src={media}
              className="w-full object-cover"
              playsInline
              muted
              loop
              preload="metadata"
              style={{ display: "block" }}
            />
          ) : (
            <img
              key={index}
              src={media}
              alt={`Image ${index + 1}`}
              className="w-full object-cover"
            />
          )
        )}
      </div>

      {/* Fade effect when not expanded */}
      {!expanded && (
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent"></div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleExpanded}
        className={`absolute transition-all duration-500 left-1/2 -translate-x-1/2 bg-gray-900 text-white py-4 px-6 rounded z-30`}
        style={{
          bottom: expanded ? "-5rem" : "40%",
          transitionDuration: expanded ? images.length + 700 + "ms" : "0ms",
        }}
      >
        {expanded ? "Close" : "View All"}
      </button>
    </div>
  );
}
