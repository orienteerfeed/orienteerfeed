import React, { useMemo } from 'react';
import { formatSecondsToTime } from '../../../utils';

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

const getLegTime = (splits, index) => {
  const currentTime = splits[index]?.time ?? null;
  const previousTime = index === 0 ? 0 : splits[index - 1]?.time ?? null;

  if (currentTime === null || previousTime === null) return null;

  return currentTime - previousTime;
};

export const SplitTable = ({ competitors }) => {
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

  // Sort competitors
  const sortedCompetitors = [...competitors].sort((a, b) => {
    const statusA = statusPriority[a.status] ?? 99;
    const statusB = statusPriority[b.status] ?? 99;
    if (statusA !== statusB) return statusA - statusB;
    return (a.time ?? Infinity) - (b.time ?? Infinity);
  });

  // Preprocess competitors data with useMemo for optimization
  const processedCompetitors = useMemo(() => {
    return calculatePositions(sortedCompetitors);
  }, [sortedCompetitors]);

  // Build the list of all controlCodes from first competitor
  const controlCodes = useMemo(() => {
    return sortedCompetitors[0]?.splits.map((split) => split.controlCode) || [];
  }, [sortedCompetitors]);

  // Determine winners' split times per control
  // Best leg times and leg positions
  const bestLegTimes = {};
  const legPositions = {}; // { [code]: { [competitorId]: position } }

  controlCodes.forEach((code, idx) => {
    let legResults = [];

    competitors.forEach((c) => {
      const legTime = getLegTime(c.splits, idx);
      if (legTime !== null && !isNaN(legTime)) {
        legResults.push({ id: c.id, time: legTime });
      }
    });

    legResults.sort((a, b) => a.time - b.time);

    bestLegTimes[code] = legResults[0]?.time ?? null;

    legPositions[code] = {};
    let pos = 1;
    for (let i = 0; i < legResults.length; i++) {
      if (i > 0 && legResults[i].time === legResults[i - 1].time) {
        legPositions[code][legResults[i].id] =
          legPositions[code][legResults[i - 1].id];
      } else {
        legPositions[code][legResults[i].id] = pos;
      }
      pos++;
    }
  });

  const calculateSplitPositions = (competitors, controlCodes) => {
    const positions = {};

    controlCodes.forEach((code) => {
      const runnersWithSplit = competitors
        .map((c) => {
          const split = c.splits.find((s) => s.controlCode === code);
          return split && typeof split.time === 'number'
            ? { id: c.id, time: split.time }
            : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.time - b.time);

      let currentPosition = 1;
      let lastTime = null;
      let positionMap = {};

      runnersWithSplit.forEach((r, i) => {
        if (lastTime !== null && r.time !== lastTime) {
          currentPosition = i + 1;
        }
        positionMap[r.id] = currentPosition;
        lastTime = r.time;
      });

      positions[code] = positionMap;
    });

    return positions;
  };

  const splitPositions = useMemo(() => {
    return calculateSplitPositions(processedCompetitors, controlCodes);
  }, [processedCompetitors, controlCodes]);

  const visibleCompetitors = processedCompetitors.filter(
    (c) => !['Active', 'Inactive', 'Finished'].includes(c.status),
  );

  let controlNo = 0;

  return (
    <div className="overflow-x-auto w-full">
      <table className="table-auto border-collapse border border-black w-full text-sm min-w-max">
        <thead>
          <tr>
            <th className="border border-black px-2 py-1" rowSpan={2}>
              #
            </th>
            <th className="border border-black px-2 py-1" rowSpan={1}>
              Name
            </th>
            <th className="border border-black px-2 py-1" rowSpan={2}>
              Finish
            </th>
            <th className="border border-black px-2 py-1" rowSpan={2}>
              Diff
            </th>
            {controlCodes.map((code, i) => {
              return (
                <th
                  key={i}
                  className="border border-black px-2 py-1 text-center"
                >
                  leg tot
                </th>
              );
            })}
            <th className="border border-black px-2 py-1 text-center">
              leg tot
            </th>
          </tr>
          <tr>
            <th>Club</th>
            {controlCodes.map((code, i) => {
              controlNo++;
              const splitFrom = controlNo - 1 === 0 ? 'S' : controlNo - 1;
              const splitTo = controlNo;
              return (
                <th
                  key={i}
                  className="border border-black px-2 py-1 text-center"
                >
                  {splitFrom}-{splitTo} ({code})
                </th>
              );
            })}
            <th className="border border-black px-2 py-1 text-center">
              {controlNo}-F
            </th>
          </tr>
        </thead>
        <tbody>
          {visibleCompetitors.map((c, i) => (
            <React.Fragment key={c.id || i}>
              <tr className="group hover:bg-gray-100">
                <td
                  className="border border-black px-2 py-1 text-center"
                  rowSpan={2}
                >
                  {c.position && c.position}
                  {c.position && typeof c.position === 'number' && '.'}
                </td>
                <td
                  className="border border-black px-2 py-1 whitespace-nowrap"
                  rowSpan={1}
                >
                  {c.lastname} {c.firstname}
                </td>
                <td
                  className="border border-black px-2 py-1 text-center"
                  rowSpan={2}
                >
                  {c.time && formatSecondsToTime(c.time)}
                </td>
                <td
                  className="border border-black px-2 py-1 text-center"
                  rowSpan={2}
                >
                  {c.loss > 0 && `+ ${formatSecondsToTime(c.loss)}`}
                </td>
                {c.splits.map((split, j) => {
                  const legTime = getLegTime(c.splits, j);
                  const code = split.controlCode;
                  const isBest = legTime === bestLegTimes[code];
                  const legPos = legPositions[code]?.[c.id];
                  return (
                    <td
                      key={j}
                      className={`border border-black px-2 py-1 text-center ${
                        isBest ? 'bg-red-200 font-bold' : ''
                      }`}
                    >
                      {legTime && formatSecondsToTime(legTime)} ({legPos})
                    </td>
                  );
                })}
                <td className="border border-black px-2 py-1 text-center">
                  {(() => {
                    const lastSplitTime = c.splits.at(-1)?.time;
                    const finishTime = c.time;
                    if (lastSplitTime && finishTime) {
                      const finalLegTime = finishTime - lastSplitTime;
                      return formatSecondsToTime(finalLegTime);
                    }
                    return;
                  })()}
                </td>
              </tr>
              <tr className="group-hover:bg-gray-100">
                <td
                  className="border border-black px-2 py-1 whitespace-nowrap"
                  rowSpan={1}
                >
                  {c.organisation}
                </td>
                {c.splits.map((split, j) => (
                  <td
                    key={j}
                    className="border border-black px-2 py-1 text-center"
                  >
                    {split.time && formatSecondsToTime(split.time)} ({' '}
                    {splitPositions[split.controlCode]?.[c.id]})
                  </td>
                ))}
                <td
                  className="border border-black px-2 py-1 text-center"
                  rowSpan={1}
                >
                  {c.time && formatSecondsToTime(c.time)}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
