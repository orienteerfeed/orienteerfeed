import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPageLayout } from '../../../templates';
import { formatTimeToHms } from '../../../utils';

export const FeaturePage = ({ t }) => {
  return (
    <LandingPageLayout>
      <div className="container mx-auto">
        <section id="start" className="min-h-screen">
          <StartFeature />
        </section>
        <section id="results" className="min-h-screen">
          Results
        </section>
      </div>
    </LandingPageLayout>
  );
};

const StartFeature = () => {
  const [competitors, setCompetitors] = useState([]);
  return (
    <div className="flex flex-col justify-center h-full py-12">
      <div className="self-center items-center flex flex-col lg:flex-row w-full md:w-5/6 xl:w-2/3 px-4 sm:px-0 justify-between">
        {/* Left Section */}
        <div className="w-full text-center sm:text-left sm:w-1/2 py-12 sm:px-8">
          <h1 className="tracking-wide text-green-900 text-2xl mb-6">
            Start:{' '}
            <span className="text-gray-800 font-bold tracking-widest">
              O-CheckList Integration
            </span>
          </h1>
          <h2 className="font-bold tracking-widest text-3xl">
            Almost Too Easy – Effortless Communication
          </h2>
          <RotatingList />
          <p className="font-bold tracking-widest text-2xl">
            Track every move, get updates on non-starting athletes, and react to
            start-line changes instantly!
          </p>
        </div>
        <OrienteerFeedDemo
          competitors={competitors}
          setCompetitors={setCompetitors}
        />
      </div>
      <EntriesTable competitors={competitors}></EntriesTable>
      <FinishGate competitors={competitors} setCompetitors={setCompetitors} />
      <div className="text-center p-8 mt-12">
        <a
          href="https://play.google.com/store/apps/details?id=se.tg3.startlist"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Download O-CheckList
        </a>
      </div>
    </div>
  );
};

const EntriesTable = ({ competitors }) => {
  // Function to check if the competitor should be highlighted based on lastUpdate
  const shouldHighlight = (lastUpdate) => {
    const currentTime = new Date().toISOString();
    const timeDiff = new Date(currentTime) - new Date(lastUpdate);
    return timeDiff <= 10000; // Highlight if last update is within the last 10 seconds
  };
  return (
    <div className="container mx-auto px-4 lg:p-24">
      <h3 className="font-bold text-xl py-2">Entries</h3>
      {competitors.length > 0 ? (
        <div className="relative overflow-x-auto rounded">
          <table className="w-full text-sm rtl:text-right">
            <thead className="text-sm text-white bg-slate-800 text-left">
              <tr>
                <th className="px-2 py-1">#</th>
                <th className="px-2 py-1">Name</th>
                <th className="px-2 py-1">Club</th>
                <th className="px-2 py-1">Card Number</th>
                <th className="px-2 py-1">Time</th>
                <th className="px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor) => (
                <tr
                  key={competitor.id}
                  className={`border-b text-left transition-all duration-1000 ease-out ${
                    shouldHighlight(competitor.lastUpdate)
                      ? 'bg-orange-200'
                      : 'bg-white'
                  }`} // Apply highlight class with smooth transition
                >
                  <td className="px-2 py-1"></td>
                  <td className="px-2 py-1">
                    {competitor.lastname} {competitor.firstname}
                  </td>
                  <td className="px-2 py-1">{competitor.organization}</td>
                  <td className="px-2 py-1">{competitor.card}</td>
                  <td className="px-2 py-1">
                    {formatTimeToHms(new Date(competitor.startTime))}
                  </td>
                  <td className="px-2 py-1 ">
                    <StatusBadge status={competitor.status} className="w-max" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No competitor selected yet</p>
      )}
    </div>
  );
};

const RotatingList = () => {
  const items = [
    'Instant updates on non-starting athletes',
    'Get the right competitor card number instantly',
    'Add new athletes to O-CheckList on the fly',
    'Register competitors directly from the start',
    'All changes automatically update in your event software',
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotate through the list every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 2000); // 2 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [items.length]);

  return (
    <div className="flex items-center h-32">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="block font-light text-browngray text-2xl my-6"
        >
          {items[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const OrienteerFeedDemo = ({ competitors, setCompetitors }) => {
  // Memoized name arrays to avoid unnecessary re-renders
  const firstNames = useMemo(
    () => [
      'Jan',
      'Ladislav',
      'Petr',
      'Jiří',
      'Marek',
      'Karel',
      'Tomáš',
      'Anna',
      'Jakub',
      'Michal',
    ],
    [],
  );

  const lastNames = useMemo(
    () => [
      'Novák',
      'Novotný',
      'Svoboda',
      'Dvořák',
      'Černý',
      'Kovář',
      'Jelínek',
      'Horák',
      'Malý',
      'Pokorný',
    ],
    [],
  );

  const getRandomItem = (array) =>
    array[Math.floor(Math.random() * array.length)];

  const generateClubNames = () => {
    const adjectives = [
      'K.O.B.',
      'SK',
      'Slavia',
      'Lokomotiva',
      'TJ',
      'SKOB',
      'OK',
    ];
    const nouns = ['Brno', 'Praha', 'Choceň', 'Kamenice', 'Hradec Králové'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
      nouns[Math.floor(Math.random() * nouns.length)]
    }`;
  };

  // Memoized initial competitors
  const initialCompetitors = useMemo(
    () => [
      {
        id: 1,
        firstname: getRandomItem(firstNames),
        lastname: getRandomItem(lastNames),
        organization: generateClubNames(),
        card: 101,
        status: 'active',
        leftDistance: 0,
        lastUpdate: '',
      },
      {
        id: 2,
        firstname: getRandomItem(firstNames),
        lastname: getRandomItem(lastNames),
        organization: generateClubNames(),
        card: 102,
        status: 'inactive',
        leftDistance: 0,
        lastUpdate: '',
      },
      {
        id: 3,
        firstname: getRandomItem(firstNames),
        lastname: getRandomItem(lastNames),
        organization: generateClubNames(),
        card: 103,
        status: 'inactive',
        leftDistance: 0,
        lastUpdate: '',
      },
    ],
    [firstNames, lastNames],
  );

  // Function to generate start times
  const generateStartTimes = useCallback((competitors) => {
    const currentTime = new Date();
    return competitors.map((competitor, index) => ({
      ...competitor,
      startTime: new Date(
        currentTime.getTime() + 10000 * (index + 1),
      ).toISOString(),
    }));
  }, []);

  // Memoized function to update competitor status
  const updateCompetitorStatus = useCallback(() => {
    setCompetitors((prevCompetitors) =>
      prevCompetitors.map((competitor) => {
        const currentTime = new Date();
        const startTime = new Date(competitor.startTime);
        return startTime < currentTime && competitor.status === 'inactive'
          ? { ...competitor, status: 'didNotStart', lastUpdate: currentTime }
          : competitor;
      }),
    );
  }, [setCompetitors]);

  // Initialize competitors and set interval for status updates
  useEffect(() => {
    const competitorsWithStartTimes = generateStartTimes(initialCompetitors);
    setCompetitors(competitorsWithStartTimes);

    const interval = setInterval(updateCompetitorStatus, 1000);
    return () => clearInterval(interval);
  }, [
    generateStartTimes,
    initialCompetitors,
    updateCompetitorStatus,
    setCompetitors,
  ]);

  // Handler to update card number
  const updateCardNumber = (id, newCard) => {
    setCompetitors((prevCompetitors) =>
      prevCompetitors.map((competitor) =>
        competitor.id === id ? { ...competitor, card: newCard } : competitor,
      ),
    );
  };

  return (
    <div>
      {competitors.filter((competitor) => !competitor.removed).length > 0 && (
        <>
          <h3 className="font-bold text-xl">Live Demo</h3>
          <ul>
            <AnimatePresence>
              {competitors
                .filter((competitor) => !competitor.removed)
                .map((competitor) => (
                  <motion.li
                    key={competitor.id}
                    initial={{ opacity: 1, x: 0 }} // Start with full opacity and no horizontal movement
                    animate={{ opacity: 1, x: 0 }} // Stay at full opacity and in place during the animation
                    exit={{ opacity: 0, x: 1000 }} // Slide out to the right with opacity 0
                    transition={{ duration: 0.5 }} // 0.5 seconds for the slide-out animation
                    style={{ margin: '10px 0' }}
                  >
                    <div className="relative flex flex-row my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96 justify-between">
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <h6 className="text-slate-800 text-xl font-semibold">
                            {competitor.lastname} {competitor.firstname}
                          </h6>
                        </div>
                        <p className="text-slate-600 leading-normal font-light">
                          <strong>Club:</strong> {competitor.organization}
                        </p>
                        <p className="text-slate-600 leading-normal font-light">
                          <strong>Start time:</strong>{' '}
                          {formatTimeToHms(new Date(competitor.startTime))}
                        </p>
                        <p className="text-slate-600 leading-normal font-light">
                          <strong>Card No:</strong>{' '}
                          <EditableCardNumber
                            card={competitor.card}
                            onSave={(newCard) =>
                              updateCardNumber(competitor.id, newCard)
                            }
                          />
                        </p>
                      </div>

                      <div className="px-4 pb-4 pt-0 mt-2">
                        <CompetitorButton
                          competitor={competitor}
                          setCompetitors={setCompetitors}
                        />
                      </div>
                    </div>
                  </motion.li>
                ))}
            </AnimatePresence>
          </ul>
        </>
      )}
    </div>
  );
};

const CompetitorButton = ({ competitor, setCompetitors }) => {
  // Update competitor status by ID
  const updateCompetitorStatus = (id) => {
    setCompetitors((prevCompetitors) =>
      prevCompetitors.map((competitor) => {
        if (competitor.id === id) {
          // Update status based on current status
          let newStatus;
          switch (competitor.status) {
            case 'inactive':
              newStatus = 'active';
              break;
            case 'active':
              newStatus = 'didNotStart';
              break;
            case 'didNotStart':
              newStatus = 'lateStart';
              break;
            case 'lateStart':
              newStatus = 'inactive';
              break;
            case 'finished':
              // Assign a random status when the competitor is finished
              const statuses = ['ok', 'missPunch', 'disqualified'];
              newStatus = statuses[Math.floor(Math.random() * statuses.length)];
              break;
            default:
              newStatus = competitor.status;
          }

          // Check if status is ok, missPunch, or disqualified, and remove competitor if true
          if (
            newStatus === 'ok' ||
            newStatus === 'missPunch' ||
            newStatus === 'disqualified'
          ) {
            removeCompetitor(competitor.id);
          }
          return { ...competitor, status: newStatus, lastUpdate: new Date() };
        }
        return competitor;
      }),
    );
  };

  // Function to remove competitor after animation
  const removeCompetitor = (id) => {
    // Set 'removed' flag to true for the competitor that needs to be removed
    setCompetitors((prevCompetitors) =>
      prevCompetitors.map((competitor) => {
        if (competitor.id === id) {
          return { ...competitor, removed: true }; // Set removed flag
        }
        return competitor;
      }),
    );
  };

  // Determine button styles and text based on status
  let buttonConfig = {};
  switch (competitor.status) {
    case 'inactive':
      buttonConfig = {
        text: 'Check',
        style: 'bg-slate-800 hover:bg-slate-700 text-white',
      };
      break;
    case 'active':
      buttonConfig = {
        text: 'Did Not Start',
        style: 'bg-red-500 hover:bg-red-400 text-white',
      };
      break;
    case 'didNotStart':
      buttonConfig = {
        text: 'Late Start',
        style: 'bg-yellow-500 hover:bg-yellow-400 text-black',
      };
      break;
    case 'lateStart':
      buttonConfig = {
        text: 'Reset',
        style: 'bg-gray-500 hover:bg-gray-400 text-white',
      };
      break;
    case 'finished':
      buttonConfig = {
        text: 'Readout',
        style: 'bg-blue-500 hover:bg-blue-400 text-white',
      };
      break;
    case 'ok':
    case 'missPunch':
    case 'disqualified':
      buttonConfig = {
        text: 'Done',
        style: 'bg-gray-500 text-white',
      };
      break;
    default:
      buttonConfig = {
        text: 'Unknown Status',
        style: 'bg-gray-500 text-white cursor-not-allowed',
      };
  }

  return (
    <button
      className={`w-full h-full rounded-md py-2 px-4 border border-transparent text-center text-sm transition-all shadow-md hover:shadow-lg focus:shadow-none active:shadow-none disabled:pointer-events-none disabled:opacity-50 ${buttonConfig.style}`}
      type="button"
      onClick={() => updateCompetitorStatus(competitor.id)}
    >
      {buttonConfig.text}
    </button>
  );
};

const EditableCardNumber = ({ card, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newCard, setNewCard] = useState(card);

  const handleSave = () => {
    setIsEditing(false);
    onSave(newCard);
  };

  return isEditing ? (
    <div className="flex">
      <input
        type="text"
        value={newCard}
        onChange={(e) => setNewCard(e.target.value)}
        className="w-24 border-gray-300 rounded p-1"
      />
      <button
        onClick={handleSave}
        className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
      >
        Save
      </button>
    </div>
  ) : (
    <span
      onClick={() => setIsEditing(true)}
      className="cursor-pointer underline text-blue-600"
    >
      {card}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  let bgColor, textColor, ringColor;

  // Set the background, text, and ring color based on the status
  switch (status) {
    case 'lateStart':
      bgColor = 'bg-yellow-50';
      textColor = 'text-yellow-800';
      ringColor = 'ring-yellow-600/20';
      break;
    case 'active':
      bgColor = 'bg-green-50';
      textColor = 'text-green-800';
      ringColor = 'ring-green-600/20';
      break;
    case 'inactive':
      bgColor = 'bg-gray-50';
      textColor = 'text-gray-600';
      ringColor = 'ring-gray-500/10';
      break;
    case 'didNotStart':
      bgColor = 'bg-red-50';
      textColor = 'text-red-700';
      ringColor = 'ring-red-600/20';
      break;
    case 'finished':
      bgColor = 'bg-blue-50';
      textColor = 'text-blue-700';
      ringColor = 'ring-blue-600/20';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      ringColor = 'ring-gray-500/10';
      break;
  }

  return (
    <span
      className={`inline-flex items-center rounded-md ${bgColor} px-2 py-1 text-xs font-medium ${textColor} ring-1 ring-inset ${ringColor}`}
    >
      {status}
    </span>
  );
};

const FinishGate = ({ competitors, setCompetitors }) => {
  // Function to update competitors' status and left distance
  const updateCompetitorStatus = useCallback(() => {
    const currentTime = new Date(); // Get the current time
    setCompetitors((prevCompetitors) => {
      return prevCompetitors.map((competitor) => {
        const startTime = new Date(competitor.startTime); // Parse startTime

        // Update competitor only if their status is 'active' or 'lateStart', and the start time is in the past
        if (
          (competitor.status === 'active' ||
            competitor.status === 'lateStart') &&
          startTime <= currentTime
        ) {
          if (competitor.leftDistance >= 100) {
            competitor.status = 'finished'; // Change status to 'finished' when the competitor reaches the finish line
            competitor.lastUpdate = currentTime;
          } else {
            competitor.leftDistance += 1; // Decrease the left distance each second
          }
        }

        return competitor;
      });
    });
  }, [setCompetitors]); // Memoize updateCompetitorStatus

  useEffect(() => {
    const interval = setInterval(() => {
      updateCompetitorStatus();
    }, 100); // Update status every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [updateCompetitorStatus]); // Runs only once on mount

  // Filter competitors based on their status and startTime
  const filteredCompetitors = competitors.filter((competitor) => {
    return (
      competitor.status === 'active' ||
      competitor.status === 'lateStart' ||
      competitor.status === 'finished'
    );
  });

  return (
    <div className="race-container px-4 lg:px-24 text-center">
      <div className="track relative w-full h-40 overflow-hidden">
        <img
          className="absolute w-20 bottom-0"
          src="/images/start.png"
          alt="Start gate"
        />
        <img
          className="absolute w-20 bottom-0 right-0"
          src="/images/finish.png"
          alt="Finish gate"
        />
        {filteredCompetitors.map((competitor) => (
          <div
            key={competitor.id}
            className={`competitor w-20 h-10 flex items-center justify-center`}
            style={{
              position: 'absolute',
              bottom: '15px',
              left: `${competitor.leftDistance}%`, // Set the left position based on leftDistance percentage
              transition: 'left 1s ease-out', // Smooth transition for movement
            }}
          >
            <img className="w-full" src="/images/runner.png" alt="Competitor" />
          </div>
        ))}
      </div>
    </div>
  );
};
