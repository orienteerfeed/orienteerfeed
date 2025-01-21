import React from 'react';
import { Card } from '../../../organisms';
import { EventForm } from '..';

export const EventInfoCard = ({ t, initialData = null }) => {
  return (
    <>
      {/* <!-- Event Form --> */}
      <Card
        title={t('Pages.Event.Card.Title')}
        description={t('Pages.Event.Card.Description')}
      >
        <EventForm t={t} initialData={initialData} />
      </Card>
    </>
  );
};
