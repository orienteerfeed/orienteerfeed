import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import PATHNAMES from '../pathnames';

export const LandingPageLayout = ({ children, illustrations = null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Function to handle clicks outside of the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-dvh bg-blue-50 text-black relative overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 flex justify-end xl:justify-between items-center px-8 py-6 border-b border-black bg-blue-50 z-20">
        <nav className="hidden xl:flex space-x-8 text-sm uppercase">
          <Link to={PATHNAMES.feature()} className="hover:underline">
            Features
          </Link>
          <Link
            to="https://obpraha.cz/orienteer-feed-docs"
            className="hover:underline"
          >
            Docs
          </Link>
          <Link to={PATHNAMES.github()} className="hover:underline">
            Collaborate
          </Link>
        </nav>
        <h1 className="absolute left-[50%] transform -translate-x-1/2 font-bold text-2xl tracking-tight">
          <Link to={PATHNAMES.empty()}>ORIENTEERFEED</Link>
        </h1>
        <nav className="flex items-center space-x-6 text-sm uppercase">
          <span className="hidden sm:block">
            <Link to={PATHNAMES.event()} className="hover:underline">
              Launch
            </Link>
          </span>
          {/* Menu Button */}
          <button
            className="text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            &#9776;
          </button>
        </nav>
      </header>

      {/* Sliding Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-lg p-6 z-20"
          >
            {/* Close Button */}
            <button
              className="text-2xl absolute top-4 right-6"
              onClick={() => setIsMenuOpen(false)}
            >
              &times;
            </button>

            {/* Menu Items */}
            <ul className="mt-12 space-y-4 text-lg">
              <li>
                <Link
                  to={PATHNAMES.event()}
                  className="block hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Launch
                </Link>
              </li>
              <li>
                <Link
                  to={PATHNAMES.feature()}
                  className="block hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="https://obpraha.cz/orienteer-feed-docs"
                  className="block hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  to={PATHNAMES.github()}
                  className="block hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Collaborate
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 bg-blue-50 pt-24">{children}</main>

      {illustrations}
    </div>
  );
};
