import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { gql, useQuery, useSubscription } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Alert, FloatingBadge } from '../../../organisms';
import { EventPageLayout } from '../../../templates';
import { useAuth } from '../../../utils';
import PATHNAMES from '../../../pathnames';
import { ResultTable } from './ResultTable';
import { WinnerNotification } from './WinnerNotifications';
import { NotificationControlPanel } from './NotificationControlPanel';

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
        length
        climb
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
      bibNumber
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
  const [classMenuOpen, setClassMenuOpen] = useState(false);

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
    setClassMenuOpen(false); // Close menu after selection
  };

  if (loading) return <p>{t('Loading', { ns: 'common' })}</p>;
  if (error)
    return (
      <p>
        {t('Error', { ns: 'common' })}: {error.message}
      </p>
    );

  const courseLengthInKm =
    (data?.event?.classes.find((c) => c.id === selectedClass)?.length ?? 0) /
    1000;
  const formattedCourseLength = courseLengthInKm.toFixed(2);
  const courseClimbthInMetres =
    data?.event?.classes.find((c) => c.id === selectedClass)?.climb ?? '';

  return (
    <EventPageLayout t={t} pageName={data?.event?.name}>
      <div className="grid items-start gap-8">
        <FloatingBadge title={data?.event?.name} />
        <div className="flex items-center justify-between">
          <div className="inline-flex items-start">
            {user?.id === data.event.authorId && (
              <div className="flex items-center">
                <Link
                  to={PATHNAMES.getEventSettings(eventId)}
                  className="bg-zinc-800 dark:bg-zinc-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full inline-block text-center"
                >
                  {t('Settings', { ns: 'common' })}
                </Link>
              </div>
            )}
          </div>
          <NotificationControlPanel className="ibline-block" />
        </div>
        {typeof data?.event !== 'undefined' &&
        data.event?.classes.length > 0 ? (
          <div className="flex gap-6">
            <div className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-4 dark:bg-zinc-700 dark:text-white">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {
                    data?.event?.classes.find((c) => c.id === selectedClass)
                      ?.name
                  }
                </h2>
                <div>
                  <p className="text-sm">
                    {formattedCourseLength} km{' '}
                    {courseClimbthInMetres &&
                      '/ ' + courseClimbthInMetres + ' m'}
                  </p>
                </div>
              </div>
              {competitors.length > 0 ? (
                <ResultTable
                  competitors={competitors}
                  event={data?.event}
                  selectedClassName={
                    data?.event?.classes.find((c) => c.id === selectedClass)
                      ?.name
                  }
                  isLoading={competitorsLoading}
                  error={competitorsError}
                />
              ) : (
                <p>{t('Pages.Event.NoCompetitorsFound')}</p>
              )}
              <WinnerNotification eventId={eventId} />
            </div>
            {/* Sidebar (Visible only on lg+) */}
            <aside className="hidden xl:flex flex-col gap-4">
              <div className="relative flex flex-col w-full rounded-2xl bg-white shadow-lg p-4 dark:bg-zinc-700 dark:text-white">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  {t('Orienteering.Class', { ns: 'common' })}
                </h2>
                <nav className="flex flex-wrap gap-4 justify-start max-h-[56rem] overflow-y-auto">
                  {[...data?.event?.classes]
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    .map((classItem) => (
                      <button
                        key={classItem.id}
                        onClick={() => onClickClass(classItem.id)}
                        className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                          selectedClass === classItem.id &&
                          'bg-accent dark:text-accent-foreground'
                        }`}
                      >
                        <span>{classItem.name}</span>
                      </button>
                    ))}
                </nav>
              </div>
            </aside>
          </div>
        ) : (
          <Alert
            variant="filled"
            severity="warning"
            title={t('Pages.Event.Alert.EventDataNotAvailableTitle')}
            className="!pl-14"
          >
            {t('Pages.Event.Alert.EventDataNotAvailableMessage')}
          </Alert>
        )}
      </div>

      {/* Floating Button (for Mobile) */}
      <button
        className="xl:hidden fixed bottom-24 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg"
        onClick={() => setClassMenuOpen(!classMenuOpen)}
      >
        {data?.event?.classes.find((c) => c.id === selectedClass)?.name ||
          'Class'}
      </button>

      {/* Mobile Menu (Slide-in from Right) */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white dark:bg-zinc-700 p-4 transform z-50 ${
          classMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out shadow-lg`}
      >
        <button
          className="absolute top-4 right-4 text-xl"
          onClick={() => setClassMenuOpen(false)}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {t('Orienteering.Class', { ns: 'common' })}
        </h2>
        <nav className="flex flex-wrap gap-2 justify-start">
          {[...data?.event?.classes]
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map((classItem) => (
              <button
                key={classItem.id}
                onClick={() => onClickClass(classItem.id)}
                className={`text-left px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  selectedClass === classItem.id &&
                  'bg-gray-300 dark:bg-gray-500'
                }`}
              >
                {classItem.name}
              </button>
            ))}
        </nav>
      </div>
    </EventPageLayout>
  );
};
