'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1695060601967-7fb135446f67?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHwxMXx8b2lsJTIwYW5kJTIwZ2FzJTIwaW5kdXN0cnklMjBkYXRhJTIwc2NpZW5jZSUyMEFJfGVufDB8MHx8fDE3NjM0MDE3NjF8MA&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
    alt: 'A group of oil pumps sitting next to each other'
  },
  {
    src: 'https://images.unsplash.com/photo-1729201754182-536252085563?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw2fHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
    alt: 'A black and white photo of an oil pump'
  },
  {
    src: 'https://images.unsplash.com/photo-1646800864458-c4ea73403075?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw1fHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
    alt: 'Oil field operations during sunset'
  },
  {
    src: 'https://images.unsplash.com/photo-1694039446022-2d227e8b104b?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHwxfHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
    alt: 'Oil pumpjack working in remote landscape'
  },
  {
    src: 'https://images.unsplash.com/photo-1596017264419-23e7af0e86db?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw4fHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
    alt: 'Sunset over industrial infrastructure'
  },
  {
    src: 'https://images.unsplash.com/photo-1562237548-2e0fd9797537?crop=entropy&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHw0fHxvaWwlMjBhbmQlMjBnYXMlMjBpbmR1c3RyeSUyMGRhdGElMjBzY2llbmNlJTIwQUl8ZW58MHwwfHx8MTc2MzQwMTc2MXww&ixlib=rb-4.1.0&w=1400&q=80&auto=format&fit=crop',
    alt: 'Active ERIELL drilling rig'
  }
];

export default function GalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (!isHovered) {
      autoplayRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isHovered, currentIndex]);

  return (
    <div 
      className="carousel-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-viewport">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="carousel-slide"
          >
            <img 
              src={images[currentIndex].src} 
              alt={images[currentIndex].alt} 
              className="carousel-image"
            />
            <div className="carousel-caption">
              <p>{images[currentIndex].alt}</p>
            </div>
          </motion.div>
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
