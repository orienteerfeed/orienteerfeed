import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import { useTranslation } from 'react-i18next';
import { EventPageLayout } from '../../../templates';
import {
  formatDate,
  useAuth,
  formatTimeToHms,
  formatSecondsToTime,
} from '../../../utils';

import PATHNAMES from '../../../pathnames';

const GET_EVENT = gql`
  query Event($eventId: String!) {
    event(id: $eventId) {
      id
      name
      organizer
      location
      country {
        countryCode
      }
      sportId
      date
      zeroTime
      ranking
      coefRanking
      startMode
      relay
      published
      authorId
      classes {
        id
        name
      }
    }
  }
`;

const GET_COMPETITORS = gql`
  query CompetitorsByClass($competitorsByClassId: Int!) {
    competitorsByClass(id: $competitorsByClassId) {
      id
      firstname
      lastname
      registration
      organisation
      card
      startTime
      finishTime
      time
      ranking
      rankPointsAvg
      status
      lateStart
      note
    }
  }
`;

export const EventDetailPage = () => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  // Extract classId from URL query parameters
  const classIdFromUrl = searchParams.get('class')
    ? parseInt(searchParams.get('class'))
    : undefined;

  // Initialize selectedClass with undefined
  const [selectedClass, setSelectedClass] = useState(
    classIdFromUrl || undefined,
  );

  // Function to handle class click and set query parameter in the URL
  const onClickClass = (classId) => {
    setSelectedClass(classId);
    setSearchParams({ class: classId }); // Update the URL with the classId as a query param
  };

  // Use the eventId as a variable in the query
  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { eventId }, // Pass eventId as a variable
  });

  //const initialData = { eventName: data.event.name };

  // Fetch competitors by class ID
  const {
    loading: competitorsLoading,
    error: competitorsError,
    data: competitorsData,
  } = useQuery(GET_COMPETITORS, {
    variables: { competitorsByClassId: selectedClass }, // Pass selectedClass as a variable
    skip: !selectedClass, // Skip query if no class is selected
  });

  /*
   * useEffect is used to update selectedClass after data is fetched.
   * When the data changes (after the query completes), it sets
   * selectedClass to the first available class (if there are any).
   */
  useEffect(() => {
    if (
      typeof selectedClass === 'undefined' &&
      data?.event?.classes?.length > 0
    ) {
      setSelectedClass(data.event.classes[0].id);
    }
  }, [selectedClass, data]); // This effect runs whenever data changes

  // Handle loading and error states
  if (loading || competitorsLoading)
    return <p>{t('Loading', { ns: 'common' })}</p>;
  if (error || competitorsError)
    return (
      <p>
        {t('Error', { ns: 'common' })}: {error.message}
      </p>
    );

  return (
    <EventPageLayout t={t}>
      <div className="grid items-start gap-8">
        <div className="flex flex-col gap-1 items-center">
          <h1 className="text-3xl md:text-4xl">
            {typeof data !== 'undefined' && data && data.event.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            {typeof data !== 'undefined' && data && data.event.organizer} |{' '}
            {typeof data !== 'undefined' &&
              data &&
              formatDate(new Date(parseInt(data.event.date, 10)))}{' '}
            | {typeof data !== 'undefined' && data && data.event.location}
          </p>
        </div>
        <hr />
        {typeof user !== 'undefined' &&
          user &&
          user.id === data.event.authorId && (
            <div>
              <Link
                to={PATHNAMES.getEventSettings(eventId)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block text-center"
              >
                {t('Settings', { ns: 'common' })}
              </Link>
            </div>
          )}
        <div className="flex gap-8">
          <div>
            {' '}
            {competitorsData?.competitorsByClass?.length > 0 ? (
              <TableComponent
                competitors={competitorsData.competitorsByClass}
                event={data?.event}
                selectedClassName={
                  data?.event?.classes.find((c) => c.id === selectedClass)?.name
                }
              />
            ) : (
              <p> {t('Pages.Event.NoCompetitorsFound')}</p>
            )}
          </div>
          <aside className="hidden md:flex flex-col gap-4">
            <p>{t('Orienteering.Class', { ns: 'common' })}</p>
            <nav className="flex flex-wrap gap-4 justify-start w-[20em] md:w-[20em] lg:w-[30em]">
              {data?.event?.classes?.length > 0 &&
                [...data.event.classes]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((classItem, index) => (
                    <button
                      key={index}
                      onClick={() => onClickClass(classItem.id)}
                      className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground 
              ${selectedClass === classItem.id && 'bg-accent'}
              `}
                    >
                      <span>{classItem.name}</span>
                    </button>
                  ))}
            </nav>
          </aside>
        </div>
      </div>
    </EventPageLayout>
  );
};

const TableComponent = ({
  competitors: initialCompetitors,
  event,
  selectedClassName,
}) => {
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

    // Calculate loss to the leader for OK runners with valid time
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
            positionWithEmoji = '🐒';
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
            positionWithEmoji = '💣';
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
        loss: lossToLeader, // Add loss to leader
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

  const calculateRunningTime = (startTime) => {
    if (!startTime) return;
    const now = new Date();
    const start = new Date(parseInt(startTime, 10));

    if (start > now) return;

    return Math.floor((now - start) / 1000);
  };
  // Initialize state with competitors and setCompetitors
  const [competitors, setCompetitors] = useState(() => {
    return calculatePositions(sortCompetitors(initialCompetitors));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCompetitors((prevCompetitors) =>
        calculatePositions(
          sortCompetitors(
            prevCompetitors.map((runner) => {
              if (runner.status === 'Active') {
                return {
                  ...runner,
                  time: calculateRunningTime(runner.startTime),
                };
              }
              return runner;
            }),
          ),
        ),
      );
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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
        <thead className="bg-gray-800 text-white">
          <tr>
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
            <th className="px-4 py-1 text-left">Diff</th>
            {showRanking && (
              <th className="px-4 py-1 text-left truncate whitespace-nowrap overflow-hidden hidden md:table-cell">
                Points
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {competitors.map((competitor, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
              data-id={competitor.id}
            >
              <td
                className="px-4 py-1"
                title={competitor.positionTooltip || ''}
              >
                {competitor.position && competitor.position + '.'}
              </td>
              <td className="px-4 py-1 truncate whitespace-nowrap overflow-hidden">
                {competitor.lastname} {competitor.firstname}
              </td>
              <td className="px-4 py-1 truncate whitespace-nowrap overflow-hidden hidden lg:table-cell">
                {competitor.organisation}
              </td>
              <td className="px-4 py-1">{competitor.bibNumber}</td>
              <td className="px-4 py-1 hidden lg:table-cell">
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
              <td className="px-4 py-1">
                {competitor.loss > 0 &&
                  '+ ' + formatSecondsToTime(competitor.loss)}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
