import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { BackButton } from '../../../molecules';
import { NotAuthorizedPage } from '../../../pages/notAuthorized';
import { EventPageLayout } from '../../../templates';

import { useAuth } from '../../../utils';

import { ProtocolTable } from './ProtocolTable';

import PATHNAMES from '../../../pathnames';

const GET_EVENT = gql`
  query Event($eventId: String!) {
    event(id: $eventId) {
      id
      name
      organizer
      authorId
    }
  }
`;

export const EventReportPage = () => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const { user } = useAuth();

  // Use the eventId as a variable in the query
  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { eventId }, // Pass eventId as a variable
  });
  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data.event || user.id !== data.event.authorId)
    return <NotAuthorizedPage />;

  return (
    <EventPageLayout t={t} pageName={data?.event?.name}>
      <div className="grid items-start gap-8">
        <BackButton t={t} path={PATHNAMES.getEventDetail(eventId)} />
        <div>
          <h1>Event Report Page</h1>
          <p>This is the Event Report Page.</p>
        </div>
        <ProtocolTable eventId={eventId} />
      </div>
    </EventPageLayout>
  );
};
