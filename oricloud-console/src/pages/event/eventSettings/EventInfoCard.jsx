import React from 'react';
import { Card } from '../../../organisms';
import { EventForm } from '..';

export const EventInfoCard = ({ t, initialData = null }) => {
  return (
    <>
      {/* <!-- Event Form --> */}
      <Card
        title={t('Page.Event.Card.Title')}
        description={t('Page.Event.Card.Description')}
      >
        <EventForm t={t} initialData={initialData} />
      </Card>
    </>
  );
};
