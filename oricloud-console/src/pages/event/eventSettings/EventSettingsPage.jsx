import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import { useTranslation } from 'react-i18next';
import { EventPageLayout } from '../../../templates';
import {
  formatDate,
  formatDateForInput,
  formatDateTimeForInput,
  useAuth,
} from '../../../utils';
import { config } from '../../../config';

import { BackButton } from '../../../molecules';
import { DragDropFile } from '../../../organisms';
import { EventInfoCard, EventPasswordCard, QrCodeCredentialsCard } from '.';
import { NotAuthorizedPage } from 'src/pages/notAuthorized';

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
      eventPassword {
        password
        expiresAt
      }
    }
  }
`;

export const EventSettingsPage = () => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const { user } = useAuth();

  const [password, setPassword] = useState(''); // Shared state for password

  // Use the eventId as a variable in the query
  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { eventId }, // Pass eventId as a variable
  });

  const apiEndpoint = config.BASE_API_URL;

  // Set password state when data is fetched
  useEffect(() => {
    if (data?.event?.eventPassword?.password) {
      setPassword(data.event.eventPassword.password);
    }
  }, [data]); // Re-run when `data` changes

  // Create initialData for EventInfoCard
  const initialData = data?.event
    ? {
        id: data.event.id,
        eventName: data.event.name,
        sportId: data.event.sportId,
        date: formatDateForInput(new Date(parseInt(data.event.date, 10))),
        organizer: data.event.organizer,
        location: data.event.location,
        country: data.event.country?.countryCode,
        zeroTime: formatDateTimeForInput(
          new Date(parseInt(data.event.zeroTime, 10)),
        ),
        ranking: data.event.ranking,
        coefRanking: data.event.coefRanking,
        relay: data.event.relay,
        published: data.event.published,
      }
    : null;

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data.event || user.id !== data.event.authorId)
    return <NotAuthorizedPage />;

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
        <BackButton t={t} path={PATHNAMES.getEventDetail(eventId)} />
        <DragDropFile eventId={eventId} />
        <div className="flex flex-row flex-wrap gap-4">
          <EventInfoCard t={t} initialData={initialData} />
          <div className="flex flex-col">
            <EventPasswordCard
              t={t}
              eventId={initialData.id}
              password={data?.event.eventPassword?.password}
              expiresAt={data?.event.eventPassword?.expiresAt}
              onPasswordUpdate={setPassword} // Pass the callback to update password
            />
          </div>
          {password && (
            <div className="flex flex-col">
              <QrCodeCredentialsCard
                t={t}
                eventId={eventId}
                eventPassword={password} // Pass updated password
                url={apiEndpoint}
              />
            </div>
          )}
        </div>
      </div>
    </EventPageLayout>
  );
};
