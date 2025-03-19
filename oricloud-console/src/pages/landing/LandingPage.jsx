import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Tooltip } from '../../atoms';
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
    <section className="text-center md:mt-8 2xl:mt-10 pb-4">
      <AnimatedText
        text={['The Live Hub for Event', 'Synchronization.']}
        className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight"
        as="h2"
      />
      <p>
        Seamlessly connect entries, start, and finish to ensure real-time
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
          className="absolute bottom-[42vh] max-h-[40vh] md:bottom-[54vh] 2xl:bottom-[46vh] w-full 2xl:max-h-[40vh] object-cover"
        />
        <Link to={PATHNAMES.event()}>
          <Tooltip content="Live results for every competitor and fan">
            <img
              src="/images/illustration/2025_orienteerfeed_v03_arena.svg"
              alt="Arena"
              className="absolute bottom-[25vh] left-[60vw] w-[40vw] md:bottom-[30vh] md:w-[38vw] lg:bottom-[36vh] lg:left-[55vw] lg:w-[30vw] 2xl:bottom-[31vh] 2xl:left-[55vw] 2xl:w-[21vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
            />
          </Tooltip>
        </Link>
        <Tooltip content="Upload changes from the readout software">
          <img
            src="/images/illustration/2025_orienteerfeed_v03_finish.svg"
            alt="Finish"
            className="absolute bottom-[8vh] left-[1vw] w-[42vw] lg:w-[32vw] 2xl:bottom-[10vh] 2xl:left-[6vw] 2xl:w-[20vw] object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
          />
        </Tooltip>
        <Tooltip content="Last-minute registrations from anywhere">
          <img
            src="/images/illustration/2025_orienteerfeed_v03_entries.svg"
            alt="Entries"
            className="absolute bottom-[9vh] right-[-7vw] w-[24vw] lg:bottom-[12vh] lg:right-[-4vw] lg:w-[20vw] 2xl:bottom-[10vh] 2xl:right-[9vw] 2xl:w-[15vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
          />
        </Tooltip>
        <img
          src="/images/illustration/2025_orienteerfeed_v03_radio.svg"
          alt="Radio"
          className="absolute bottom-[45vh] left-[35vw] w-[17vw] md:bottom-[59vh] 2xl:bottom-[54vh] 2xl:left-[36vw] 2xl:w-[15vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
        />
        <Link to={PATHNAMES.getFeature('start')}>
          <Tooltip content="Receive changes from the start line">
            <img
              src="/images/illustration/2025_orienteerfeed_v03_start.svg"
              alt="Start"
              className="absolute bottom-[32vh] right-[-17.5vw] w-[38vw] md:bottom-[38vh] lg:bottom-[36vh] lg:right-[-13vw] lg:w-[32vw] 2xl:bottom-[30vh] 2xl:right-[-3.5vw] 2xl:w-[25vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
            />
          </Tooltip>
        </Link>
        <Link to={PATHNAMES.getFeature('it')}>
          <Tooltip content="Sync updates with event management software">
            <img
              src="/images/illustration/2025_orienteerfeed_v03_it_centrum.svg"
              alt="IT Centrum"
              className="absolute bottom-[2vh] left-[52vw] w-[18vw] md:left-[56vw] lg:left-[49vw] lg:w-[16vw] 2xl:bottom-[7vh] 2xl:left-[37vw] 2xl:w-[14vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
            />
          </Tooltip>
        </Link>
        <Link to={PATHNAMES.mrb()}>
          <Tooltip content="Project live results onto screens">
            <img
              src="/images/illustration/2025_orienteerfeed_v03_results.svg"
              alt="Results"
              className="absolute bottom-[16vh] left-[59vw] w-[18vw] md:bottom-[18vh] md:w-[16vw] lg:bottom-[20vh] lg:left-[55vw] lg:w-[12vw] 2xl:bottom-[12vh] 2xl:left-[55vw] 2xl:w-[12vw] transform -translate-x-1/2 object-cover transition-transform duration-300 ease-in-out hover:scale-105 z-20"
            />
          </Tooltip>
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
      <section className="flex flex-col items-center text-center px-4 mt-0 xl:mt-10">
        <HeroSection />
      </section>
    </LandingPageLayout>
  );
};
