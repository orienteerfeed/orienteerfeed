import React from 'react';
import { Card } from '../../../organisms';
import { EventForm } from '..';

export const EventInfoCard = ({ t, initialData = null }) => {
  return (
    <>
      {/* <!-- Event Form --> */}
      <Card
        title="Event Information"
        description="Please fill out the form below to update the event details."
      >
        <EventForm t={t} initialData={initialData} />
      </Card>
    </>
  );
};
