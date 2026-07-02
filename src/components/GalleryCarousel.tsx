'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryCarouselProps {
  images?: { src: string; alt: string }[];
  slidingEffect?: 'slide' | 'fade';
  autoplaySpeed?: number;
}

export default function GalleryCarousel({
  images = [],
  slidingEffect = 'slide',
  autoplaySpeed = 5000
}: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Reset index when image list shrinks (runs after render, so we also use safeIndex below)
  useEffect(() => {
    if (images.length > 0 && currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: slidingEffect === 'slide' ? (dir > 0 ? 300 : -300) : 0,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: slidingEffect === 'slide' ? (dir < 0 ? 300 : -300) : 0,
      opacity: 0
    })
  };

  const handleNext = () => {
    if (images.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (images.length === 0) return;
    if (!isHovered && autoplaySpeed > 0) {
      autoplayRef.current = setInterval(() => {
        handleNext();
      }, autoplaySpeed);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isHovered, currentIndex, images.length, autoplaySpeed]);

  if (images.length === 0) {
    return (
      <div className="carousel-viewport" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface)' }}>
        <p style={{ color: 'var(--text-muted)' }}>No images available in gallery.</p>
      </div>
    );
  }

  return (
    <div 
      className="carousel-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-viewport">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {(() => {
            const safeIndex = images.length > 0 ? Math.min(currentIndex, images.length - 1) : 0;
            const image = images[safeIndex];
            if (!image) return null;
            return (
          <motion.div
            key={safeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="carousel-slide"
          >
            <img 
              src={image.src} 
              alt={image.alt} 
              className="carousel-image"
            />
            <div className="carousel-caption">
              <p>{image.alt}</p>
            </div>
          </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button className="carousel-arrow left" onClick={handlePrev} aria-label="Previous image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="carousel-arrow right" onClick={handleNext} aria-label="Next image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
