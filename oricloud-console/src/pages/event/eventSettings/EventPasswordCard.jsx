import React from 'react';
import { Card } from '../../../organisms';
import { EventPasswordForm } from '..';

export const EventPasswordCard = ({ t, eventId, ...otherProps }) => {
  return (
    <>
      {/* <!-- Event Form --> */}
      <Card
        title={t('Pages.Event.Password.Card.Title')}
        description={t('Pages.Event.Password.Card.Description')}
      >
        {/* Spread otherProps to EventPasswordForm */}
        <EventPasswordForm t={t} eventId={eventId} {...otherProps} />
      </Card>
    </>
  );
};
