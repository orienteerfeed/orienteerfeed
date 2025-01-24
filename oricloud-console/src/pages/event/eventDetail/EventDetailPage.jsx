import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { gql, useQuery, useSubscription } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { EventPageLayout } from '../../../templates';
import { formatDate, useAuth } from '../../../utils';
import PATHNAMES from '../../../pathnames';
import { ResultTable } from './ResultTable';

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

const COMPETITORS_BY_CLASS_UPDATED = gql`
  subscription CompetitorsByClassUpdated($classId: Int!) {
    competitorsByClassUpdated(classId: $classId) {
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

  const classIdFromUrl = searchParams.get('class')
    ? parseInt(searchParams.get('class'))
    : undefined;

  const [selectedClass, setSelectedClass] = useState(
    classIdFromUrl || undefined,
  );
  const [competitors, setCompetitors] = useState([]);

  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { eventId },
  });

  // Subscribe to competitors updates
  const {
    loading: competitorsLoading,
    error: competitorsError,
    data: competitorsData,
  } = useSubscription(COMPETITORS_BY_CLASS_UPDATED, {
    variables: { classId: selectedClass },
    skip: !selectedClass, // Skip subscription if no class is selected
  });

  // Combine effects for selected class and competitors
  useEffect(() => {
    // Automatically set selectedClass to the first available class
    if (!selectedClass && data?.event?.classes?.length > 0) {
      setSelectedClass(data.event.classes[0].id);
    }

    // Update competitors state whenever competitorsData changes
    if (competitorsData) {
      setCompetitors(competitorsData.competitorsByClassUpdated);
    }
  }, [data, selectedClass, competitorsData]);

  const onClickClass = (classId) => {
    setSelectedClass(classId);
    setSearchParams({ class: classId }); // Update URL
  };

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
          <h1 className="text-3xl md:text-4xl">{data?.event?.name}</h1>
          <p className="text-lg text-muted-foreground">
            {data?.event?.organizer} |{' '}
            {formatDate(new Date(parseInt(data.event.date, 10)))} |{' '}
            {data?.event?.location}
          </p>
        </div>
        <hr />
        {user?.id === data.event.authorId && (
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
            {competitors.length > 0 ? (
              <ResultTable
                competitors={competitors}
                event={data?.event}
                selectedClassName={
                  data?.event?.classes.find((c) => c.id === selectedClass)?.name
                }
              />
            ) : (
              <p>{t('Pages.Event.NoCompetitorsFound')}</p>
            )}
          </div>
          <aside className="hidden md:flex flex-col gap-4">
            <p>{t('Orienteering.Class', { ns: 'common' })}</p>
            <nav className="flex flex-wrap gap-4 justify-start w-[20em] md:w-[20em] lg:w-[30em]">
              {[...data?.event?.classes]
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((classItem) => (
                  <button
                    key={classItem.id}
                    onClick={() => onClickClass(classItem.id)}
                    className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                      selectedClass === classItem.id && 'bg-accent'
                    }`}
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
