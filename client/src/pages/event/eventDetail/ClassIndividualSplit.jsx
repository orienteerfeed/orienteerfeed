import React, { useEffect, useState } from 'react';
import { gql, useSubscription } from '@apollo/client';
import { Alert } from '../../../organisms';
import { SplitTable } from './SplitTable';

const COMPETITORS_WITH_SPLITS_BY_CLASS_UPDATED = gql`
  subscription CompetitorsByClassUpdated($classId: Int!) {
    competitorsByClassUpdated(classId: $classId) {
      id
      firstname
      lastname
      organisation
      finishTime
      time
      status
      splits {
        controlCode
        time
      }
    }
  }
`;

export const ClassIndividualSplit = ({
  t,
  data,
  selectedClass,
  setSelectedClass,
  setSearchParams,
}) => {
  const [competitors, setCompetitors] = useState([]);
  const [classMenuOpen, setClassMenuOpen] = useState(false);

  // Subscribe to competitors updates
  const {
    loading: competitorsLoading,
    error: competitorsError,
    data: competitorsData,
  } = useSubscription(COMPETITORS_WITH_SPLITS_BY_CLASS_UPDATED, {
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
  }, [data, selectedClass, setSelectedClass, competitorsData]);

  const onClickClass = (classId) => {
    setSelectedClass(classId);
    setSearchParams({ class: classId }); // Update URL
    setClassMenuOpen(false); // Close menu after selection
  };

  const courseLengthInKm =
    (data?.event?.classes.find((c) => c.id === selectedClass)?.length ?? 0) /
    1000;
  const formattedCourseLength = courseLengthInKm.toFixed(2);
  const courseClimbthInMetres =
    data?.event?.classes.find((c) => c.id === selectedClass)?.climb ?? '';

  return (
    <>
      {typeof data?.event !== 'undefined' && data.event?.classes.length > 0 ? (
        <div className="flex gap-6">
          <div className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-4 dark:bg-zinc-700 dark:text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {data?.event?.classes.find((c) => c.id === selectedClass)?.name}
              </h2>
              <div>
                <p className="text-sm">
                  {formattedCourseLength} km{' '}
                  {courseClimbthInMetres && '/ ' + courseClimbthInMetres + ' m'}
                </p>
              </div>
            </div>
            {typeof competitors !== 'undefined' && competitors.length > 0 ? (
              <SplitTable
                competitors={competitors}
                event={data?.event}
                selectedClassName={
                  data?.event?.classes.find((c) => c.id === selectedClass)?.name
                }
                isLoading={competitorsLoading}
                error={competitorsError}
              />
            ) : (
              <p>{t('Pages.Event.NoCompetitorsFound')}</p>
            )}
          </div>
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

      <div className="xl:hidden fixed bottom-20 right-0 z-50 group">
        <button
          onClick={() => setClassMenuOpen(!classMenuOpen)}
          className={`
      flex items-center bg-neutral-800 dark:bg-neutral-400 text-white rounded-l-full shadow-lg
      overflow-hidden h-12 pr-6 pl-4
      transition-all duration-300 ease-in-out
      ${classMenuOpen ? 'max-w-[200px]' : 'max-w-[140px] group-hover:max-w-[200px]'}
    `}
        >
          {/* Výchozí text "< Kategorie" */}
          <span
            className={`
        whitespace-nowrap text-sm absolute
        transition-opacity duration-200 ease-in-out
        ${classMenuOpen ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}
      `}
          >
            Kategorie
          </span>

          {/* Název třídy */}
          <span
            className={`
        whitespace-nowrap text-sm ml-2
        transition-opacity duration-200 ease-in-out
        ${classMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
      `}
          >
            {data?.event?.classes.find((c) => c.id === selectedClass)?.name ||
              'Class'}
          </span>
        </button>
      </div>

      {/* Mobile Menu (Slide-in from Right) */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white dark:bg-zinc-700 p-4 transform z-50 ${
          classMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out shadow-lg`}
      >
        <button
          className="absolute top-4 right-4 text-xl dark:text-white"
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
                className={`text-left px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white ${
                  selectedClass === classItem.id &&
                  'bg-gray-300 dark:bg-gray-500'
                }`}
              >
                {classItem.name}
              </button>
            ))}
        </nav>
      </div>
    </>
  );
};
