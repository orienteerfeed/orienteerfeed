import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import { useTranslation } from 'react-i18next';
import { EventPageLayout } from '../../../templates';
import { formatDate, useAuth } from '../../../utils';

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
  if (loading || competitorsLoading) return <p>Loading...</p>;
  if (error || competitorsError) return <p>Error: {error.message}</p>;

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
                Settings
              </Link>
            </div>
          )}
        <div className="flex gap-8">
          <div>
            <h2>Competitors List</h2>
            {competitorsData?.competitorsByClass?.length > 0 ? (
              competitorsData.competitorsByClass.map((competitor) => (
                <div key={competitor.id}>
                  <p>
                    {competitor.firstname} {competitor.lastname} -{' '}
                    {competitor.organisation}
                  </p>
                </div>
              ))
            ) : (
              <p>No competitors found for the selected class.</p>
            )}
          </div>
          <aside className="hidden md:flex flex-col gap-4">
            <p>Class</p>
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
