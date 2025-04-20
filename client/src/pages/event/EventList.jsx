import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetchRequest } from '../../utils';

import { EventTable } from '.';

import ENDPOINTS from '../../endpoints';

export const EventList = () => {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const { data, isLoading, error } = useFetchRequest(ENDPOINTS.events());

  // Pokud nejsou data k dispozici, vrátíme prázdné pole
  const eventData = data?.results?.data || [];

  // Filter todays events
  const todaysEvents =
    eventData.filter((event) => {
      const today = new Date().toISOString().split('T')[0]; // Get todays date in format YYYY-MM-DD
      const eventDate = new Date(event.date).toISOString().split('T')[0]; // Get event date
      return eventDate === today; // Compare only dates (without time)
    }) || [];

  // Filter recent events
  const recentEvents =
    eventData.filter((event) => {
      const today = new Date().toISOString().split('T')[0]; // Get todays date in format YYYY-MM-DD
      const eventDate = new Date(event.date).toISOString().split('T')[0]; // Get event date
      return eventDate < today; // Compare only dates (without time)
    }) || [];

  // Filter upcoming events
  const upcomingEvents =
    eventData.filter((event) => {
      const today = new Date().toISOString().split('T')[0]; // Get todays date in format YYYY-MM-DD
      const eventDate = new Date(event.date).toISOString().split('T')[0]; // Get event date
      return eventDate > today; // Compare only dates (without time)
    }) || [];
  return (
    <div className="flex flex-col gap-6">
      {/* Full width event table */}
      <div className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-4 dark:bg-zinc-700 dark:text-white">
        <h2 className="font-semibold dark:text-white pb-4">
          {t('Pages.Event.Tables.Today')}
        </h2>
        <EventTable
          t={t}
          navigate={navigate}
          data={todaysEvents}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Two divs side by side (50% width on large screens, full width on smaller screens) */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex flex-col w-full lg:w-1/2 h-full rounded-2xl bg-white shadow-lg p-4 dark:bg-zinc-700 dark:text-white">
          <h2 className="font-semibold dark:text-white pb-4">
            {t('Pages.Event.Tables.Recent')}
          </h2>
          <EventTable
            t={t}
            navigate={navigate}
            data={recentEvents}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <div className="relative flex flex-col w-full lg:w-1/2 h-full rounded-2xl bg-white shadow-lg p-4 dark:bg-zinc-700 dark:text-white">
          <h2 className="font-semibold dark:text-white pb-4">
            {t('Pages.Event.Tables.Upcoming')}
          </h2>
          <EventTable
            t={t}
            navigate={navigate}
            data={upcomingEvents}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};
