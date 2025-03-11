import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LandingPageLayout } from '../../templates';

import PATHNAMES from '../../pathnames';

const AnimatedText = ({ text, className, as = 'h2' }) => {
  const Tag = as;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Delays animation per letter
      },
    },
  };

  const letterVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="inline-block overflow-hidden"
    >
      <Tag className={className}>
        {Array.isArray(text)
          ? text.map((line, index) => (
              <div key={index} className="block">
                {line.split(' ').map((word, i) => (
                  <React.Fragment key={i}>
                    <motion.span
                      variants={letterVariants}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                    {i !== line.split(' ').length - 1 && <span>&nbsp;</span>}
                  </React.Fragment>
                ))}
              </div>
            ))
          : text.split(' ').map((word, index, arr) => (
              <React.Fragment key={index}>
                <motion.span variants={letterVariants} className="inline-block">
                  {word}
                </motion.span>
                {index !== arr.length - 1 && <span>&nbsp;</span>}
              </React.Fragment>
            ))}
      </Tag>
    </motion.div>
  );
};

const HeroSection = () => {
  return (
    <section className="text-center mt-10">
      <AnimatedText
        text={['The Live Hub for Event', 'Synchronization.']}
        className="text-5xl md:text-7xl font-bold leading-tight"
        as="h2"
      />
      <p>
        Seamlessly connect start, entries, and finish to ensure real-time
        updates, keeping results always up-to-date and every detail in perfect
        sync.
      </p>
    </section>
  );
};

export const LandingPage = () => {
  const illustrations = (
    <>
      {/* Background Illustrations */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <img
          src="/images/illustration/2025_orienteerfeed_v03_forest_background.svg"
          alt="Forest"
          className="absolute bottom-[49vh] w-full max-h-[40vh] object-cover"
        />
        <img
          src="/images/illustration/2025_orienteerfeed_v03_arena.svg"
          alt="Arena"
          className="absolute bottom-[31vh] left-[55vw] transform -translate-x-1/2 w-[21vw] object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
        />
        <img
          src="/images/illustration/2025_orienteerfeed_v03_finish.svg"
          alt="Finish"
          className="absolute bottom-[6vh] left-[6vw] w-[20vw] object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
        />
        <img
          src="/images/illustration/2025_orienteerfeed_v03_entries.svg"
          alt="Entries"
          className="absolute bottom-[10vh] right-[9vw] w-[15vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
        />
        <img
          src="/images/illustration/2025_orienteerfeed_v03_radio.svg"
          alt="Radio"
          className="absolute bottom-[56vh] left-[36vw] w-[15vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
        />
        <Link to={PATHNAMES.getFeature('start')}>
          <img
            src="/images/illustration/2025_orienteerfeed_v03_start.svg"
            alt="Start"
            className="absolute bottom-[30vh] right-[-3.5vw] w-[25vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
          />
        </Link>
        <Link to={PATHNAMES.getFeature('it')}>
          <img
            src="/images/illustration/2025_orienteerfeed_v03_it_centrum.svg"
            alt="IT Centrum"
            className="absolute bottom-[7vh] left-[37vw] w-[14vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
          />
        </Link>
        <Link to={PATHNAMES.getFeature('results')}>
          <img
            src="/images/illustration/2025_orienteerfeed_v03_results.svg"
            alt="Results"
            className="absolute bottom-[12vh] left-[55vw] w-[12vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
          />
        </Link>
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
    </>
  );
  return (
    <LandingPageLayout illustrations={illustrations}>
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 mt-20">
        <HeroSection />
      </section>
    </LandingPageLayout>
  );
};
