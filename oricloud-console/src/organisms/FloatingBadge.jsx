import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const FloatingBadge = ({ title }) => {
  const [showBadge, setShowBadge] = useState(false);
  const lastScrollY = useRef(0); // Preserve scroll position across renders

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current && currentScrollY > 50) {
        // User is scrolling up and has scrolled a bit
        setShowBadge(true);

        // Hide badge after 3 seconds
        setTimeout(() => {
          setShowBadge(false);
        }, 3000);
      }

      lastScrollY.current = currentScrollY; // Update the ref value
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0, x: '-50%' }} // Start off-screen and invisible
      animate={
        showBadge
          ? { y: 0, opacity: 1, x: '-50%' }
          : { y: -50, opacity: 0, x: '-50%' }
      } // Animate in and out
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      }} // Smooth spring animation
      className="fixed top-24 left-1/2 z-50 transform -translate-x-1/2 bg-zinc-700 text-white text-xs px-4 py-1 rounded-full shadow-lg md:hidden"
    >
      {title}
    </motion.div>
  );
};
