import React, { useMemo, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { formatTimeToHms, formatSecondsToTime } from '../../../utils';

export const ResultTable = ({ competitors, event, selectedClassName }) => {
  const [highlightedRows, setHighlightedRows] = useState([]);
  const previousCompetitorsRef = useRef([]);

  // Helper functions for data preprocessing
  const calculatePositions = (runners) => {
    const clonedRunners = runners.map((runner) => ({ ...runner }));

    const finishedRunners = clonedRunners.filter(
      (runner) => runner.status === 'OK' && runner.time,
    );

    finishedRunners.sort((a, b) => a.time - b.time);

    let position = 1;
    for (let i = 0; i < finishedRunners.length; i++) {
      if (i > 0 && finishedRunners[i].time === finishedRunners[i - 1].time) {
        finishedRunners[i].position = finishedRunners[i - 1].position;
      } else {
        finishedRunners[i].position = position;
      }
      position++;
    }

    const leaderTime = finishedRunners[0]?.time || null;

    return clonedRunners.map((runner) => {
      const finished = finishedRunners.find((r) => r.id === runner.id);

      let positionWithEmoji = null;
      let positionTooltip = null;
      let lossToLeader = null;
      if (finished) {
        lossToLeader = leaderTime !== null ? finished.time - leaderTime : null;
      } else {
        switch (runner.status) {
          case 'Active':
            positionWithEmoji = '🏃';
            positionTooltip = 'Giving it their all right now';
            break;
          case 'DidNotFinish':
            positionWithEmoji = '🏳️';
            positionTooltip = 'Did Not Finish';
            break;
          case 'DidNotStart':
            positionWithEmoji = '🚷';
            positionTooltip = 'Did not start';
            break;
          case 'Disqualified':
            positionWithEmoji = '🟥';
            positionTooltip = 'Disqualified';
            break;
          case 'Finished':
            positionWithEmoji = '🏁';
            positionTooltip = 'Waiting for readout';
            break;
          case 'Inactive':
            positionWithEmoji = '🛏️';
            positionTooltip = 'Waiting for start time';
            break;
          case 'MissingPunch':
            positionWithEmoji = '🙈';
            positionTooltip = 'Missing Punch';
            break;
          case 'NotCompeting':
            positionWithEmoji = '🦄';
            positionTooltip = 'Not competing';
            break;
          case 'OverTime':
            positionWithEmoji = '⌛';
            positionTooltip = 'Over Time';
            break;
          default:
            positionWithEmoji = null;
            positionTooltip = null;
        }
      }

      return {
        ...runner,
        position: finished ? finished.position : positionWithEmoji,
        positionTooltip: finished ? null : positionTooltip,
        loss: lossToLeader,
      };
    });
  };

  const sortCompetitors = (runners) => {
    const statusPriority = {
      OK: 0,
      Active: 1,
      Finished: 2,
      Inactive: 3,
      NotCompeting: 4,
      OverTime: 5,
      Disqualified: 6,
      MissingPunch: 7,
      DidNotFinish: 8,
      DidNotStart: 9,
    };

    return runners.slice().sort((a, b) => {
      const statusA = statusPriority[a.status];
      const statusB = statusPriority[b.status];

      if (statusA !== statusB) {
        return statusA - statusB;
      }

      if (a.status === 'OK' && b.status === 'OK') {
        return a.time - b.time;
      }

      return new Date(a.startTime) - new Date(b.startTime);
    });
  };

  // Preprocess competitors data with useMemo for optimization
  const processedCompetitors = useMemo(() => {
    const sortedCompetitors = sortCompetitors(competitors);
    return calculatePositions(sortedCompetitors);
  }, [competitors]);

  // Highlight rows on updates
  useEffect(() => {
    if (previousCompetitorsRef.current.length) {
      const changedRows = competitors.filter((competitor) => {
        const prevCompetitor = previousCompetitorsRef.current.find(
          (prev) => prev.id === competitor.id,
        );
        return (
          prevCompetitor &&
          JSON.stringify(competitor) !== JSON.stringify(prevCompetitor)
        );
      });

      const changedIds = changedRows.map((competitor) => competitor.id);
      setHighlightedRows(changedIds);

      const timeout = setTimeout(() => {
        setHighlightedRows([]);
      }, 10000); // Reset after 10 seconds

      return () => clearTimeout(timeout);
    }

    // Update the ref with the current state
    previousCompetitorsRef.current = competitors;
  }, [competitors]);

  const showRanking =
    event.ranking &&
    selectedClassName &&
    (selectedClassName.startsWith('D21') ||
      selectedClassName.startsWith('H21') ||
      selectedClassName.startsWith('M21') ||
      selectedClassName.startsWith('W21'));

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse text-sm">
        <thead className="text-gray-600 dark:text-white">
          <tr className="border-b dark:border-gray-700">
            <th className="px-4 py-1 text-left">#</th>
            <th className="px-4 py-1 text-left truncate whitespace-nowrap overflow-hidden">
              Name
            </th>
            <th className="px-4 py-1 text-left truncate whitespace-nowrap overflow-hidden hidden lg:table-cell">
              Club
            </th>
            <th className="px-4 py-1 text-left truncate whitespace-nowrap overflow-hidden">
              Bib N.
            </th>
            <th className="px-4 py-1 text-left truncate whitespace-nowrap overflow-hidden hidden lg:table-cell">
              Card
            </th>
            <th className="px-4 py-1 text-left">Start</th>
            <th className="px-4 py-1 text-left">Finish</th>
            <th className="px-4 py-1 text-left truncate whitespace-nowrap overflow-hidden">
              Diff
            </th>
            {showRanking && (
              <th className="px-4 py-1 text-left truncate whitespace-nowrap overflow-hidden hidden md:table-cell">
                Points
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {processedCompetitors.map((competitor, index) => (
            <motion.tr
              key={competitor.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              className={`transition-colors duration-500 border-b dark:border-gray-700 ${
                highlightedRows.includes(competitor.id)
                  ? 'bg-orange-200'
                  : index % 2 === 0
                  ? 'bg-gray-100'
                  : 'bg-white'
              }`}
            >
              <td
                className="px-4 py-1"
                title={competitor.positionTooltip || ''}
              >
                {competitor.position && competitor.position}
                {competitor.position &&
                  typeof competitor.position === 'number' &&
                  '.'}
              </td>
              <td className="px-4 py-1 truncate whitespace-nowrap overflow-hidden">
                {competitor.lastname} {competitor.firstname}
              </td>
              <td className="px-4 py-1 truncate whitespace-nowrap overflow-hidden hidden lg:table-cell">
                {competitor.organisation}
              </td>
              <td className="px-4 py-1 truncate whitespace-nowrap overflow-hidden">
                {competitor.bibNumber}
              </td>
              <td className="px-4 py-1 truncate whitespace-nowrap overflow-hidden hidden lg:table-cell">
                {competitor.card}
              </td>
              <td className="px-4 py-1">
                {competitor.startTime &&
                  formatTimeToHms(new Date(parseInt(competitor.startTime, 10)))}
                {competitor.lateStart && (
                  <span className="pl-1" title="Late start">
                    ⚠️
                  </span>
                )}
              </td>
              <td className="px-4 py-1">
                {competitor.time && formatSecondsToTime(competitor.time)}
              </td>
              <td className="px-4 py-1 truncate whitespace-nowrap overflow-hidden">
                {competitor.loss > 0 &&
                  `+ ${formatSecondsToTime(competitor.loss)}`}
              </td>
              {showRanking && (
                <td className="px-4 py-1 truncate whitespace-nowrap overflow-hidden hidden md:table-cell">
                  {competitor.ranking && competitor.rankPointsAvg && (
                    <div
                      className={`inline-flex items-center px-2 py-0.5 text-[9px] font-medium text-white rounded-full 
                      ${
                        competitor.ranking > competitor.rankPointsAvg
                          ? 'bg-green-500' // Green for higher rankings
                          : 'bg-red-500' // Red for lower rankings
                      }`}
                      style={{
                        height: '16px', // Smaller badge height
                        lineHeight: '16px', // Align text vertically
                      }}
                    >
                      {competitor.ranking > competitor.rankPointsAvg ? (
                        <span className="mr-1 text-[10px]">↗</span> // Smaller up arrow
                      ) : (
                        <span className="mr-1 text-[10px]">↘</span> // Smaller down arrow
                      )}
                      {competitor.ranking}
                    </div>
                  )}
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
