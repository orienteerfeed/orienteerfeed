import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import PATHNAMES from '../pathnames';

export const LandingPageLayout = () => {
  return (
    <div className="min-h-screen bg-[#f5efe3] text-black">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-black">
        <nav className="flex space-x-8 text-sm uppercase">
          <Link to={PATHNAMES.event()} className="hover:underline">
            Events
          </Link>
          <Link
            to="https://obpraha.cz/orienteer-feed-docs"
            className="hover:underline"
          >
            Docs
          </Link>
          <Link
            to="https://github.com/martinkrivda/orienteerfeed"
            className="hover:underline"
          >
            Collaborate
          </Link>
        </nav>
        <h1 className="font-bold text-2xl tracking-tight">ORIENTEERFEED</h1>
        <nav className="flex items-center space-x-6 text-sm uppercase">
          <Link to={PATHNAMES.event()} className="hover:underline">
            Launch APP
          </Link>
          <button className="text-xl">&#9776;</button> {/* Menu icon */}
        </nav>
      </header>
      <main>
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center px-4 mt-20">
          <motion.h2
            className="text-5xl md:text-7xl font-bold leading-tight"
            initial={{ scaleY: 0, opacity: 0, transformOrigin: 'bottom' }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            The Live Hub for Event
            <br /> Synchronization.
          </motion.h2>

          <motion.p
            className="text-lg text-gray-700 mt-4"
            initial={{ scaleY: 0, opacity: 0, transformOrigin: 'bottom' }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          >
            Seamlessly connect start, entries, and finish to ensure real-time
            updates, keeping results always up-to-date and every detail in
            perfect sync.
          </motion.p>
        </section>

        {/* Image positioned at the bottom */}
        <div className="w-full max-h-[80vh] flex gap-4 overflow-hidden">
          <img
            src="/images/illustration/2025_orienteerfeed_v03_forest_background.svg"
            alt="Forest"
            className="absolute bottom-[49vh] w-full max-h-[40vh] object-cover"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_arena.svg"
            alt="Arena"
            className="absolute bottom-[31vh] left-[49vw] transform -translate-x-1/2 w-[30vw] object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_finish.svg"
            alt="Finish"
            className="absolute bottom-[6vh] left-[3vw] w-[28vw] object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_entries.svg"
            alt="Entries"
            className="absolute bottom-[11vh] right-[4vw] w-[20vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_radio.svg"
            alt="Radio"
            className="absolute bottom-[56vh] left-[36vw] w-[18vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_start.svg"
            alt="Start"
            className="absolute bottom-[37vh] right-[-0.5vw] w-[30vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_it_centrum.svg"
            alt="IT Centrum"
            className="absolute bottom-[7vh] left-[37vw] w-[14vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_results.svg"
            alt="Results"
            className="absolute bottom-[12vh] left-[55vw] w-[12vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
          />
          <img
            src="/images/illustration/2025_orienteerfeed_v03_bottom_frame.svg"
            alt="Trees"
            className="absolute bottom-0 w-full h-auto object-cover"
          />
          {/*
            <img
            src="/images/illustration/2025_orienteerfeed_v03_all.svg"
            alt="Forest"
            className="absolute bottom-0 w-full h-full max-h-[80vh] object-cover"
          />
           */}
        </div>

        {/* Topography Map */}

        {/* Markers */}
        {[
          { id: '008', x: '20%', y: '30%' },
          { id: '042', x: '40%', y: '60%' },
          { id: '063', x: '70%', y: '20%' },
        ].map((marker) => (
          <div
            key={marker.id}
            className="absolute flex flex-col items-center"
            style={{ left: marker.x, top: marker.y }}
          >
            <div className="h-32 border-l-2 border-orange-500"></div>
            <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {marker.id}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
