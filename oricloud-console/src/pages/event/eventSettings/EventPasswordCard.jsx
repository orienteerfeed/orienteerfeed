import React from 'react';
import { Card } from '../../../organisms';
import { EventPasswordForm } from '..';

export const EventPasswordCard = ({ t, eventId, ...otherProps }) => {
  return (
    <>
      {/* <!-- Event Form --> */}
      <Card
        title="Event Password"
        description="Please fill out the form below to update the event details."
      >
        {/* Spread otherProps to EventPasswordForm */}
        <EventPasswordForm t={t} eventId={eventId} {...otherProps} />
      </Card>
    </>
  );
};
