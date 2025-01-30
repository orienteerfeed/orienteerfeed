import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TableFetchState } from '../../molecules';
import { useFetchRequest, formatDate } from '../../utils';

import ENDPOINTS from '../../endpoints';

const EventTable = ({ navigate, data, isLoading, error }) => {
  const { t } = useTranslation('translation');
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse text-sm text-left">
        <thead className="text-gray-600 dark:text-white">
          <tr className="border-b dark:border-gray-700">
            <th scope="col" className="px-6 py-2 font-medium text-gray-900">
              {t('Pages.Event.Tables.Name')}
            </th>
            <th scope="col" className="px-6 py-2 font-medium text-gray-900">
              {t('Pages.Event.Tables.Organiser')}
            </th>
            <th scope="col" className="px-6 py-2 font-medium text-gray-900">
              {t('Pages.Event.Tables.Date')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {typeof data !== 'undefined' && data && data.length > 0 ? (
            data.map((event, index) => (
              <tr
                key={index}
                onClick={() => navigate('/event/' + event.id)}
                className={`hover:bg-gray-50 cursor-pointer transition-colors duration-500 border-b dark:border-gray-700 ${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                }`}
              >
                <td className="flex gap-3 px-6 py-2 font-normal text-gray-900">
                  <div className="text-sm">
                    <div className="font-medium text-gray-700">
                      {event.name}
                    </div>
                    <div className="text-gray-400">{event.location}</div>
                  </div>
                </td>
                <td className="px-6 py-2">{event.organizer}</td>
                <td className="px-6 py-2">{formatDate(event.date)}</td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={4}>
                <TableFetchState isLoading={isLoading} error={error} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

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
      <div className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-4 dark:bg-gray-900 dark:text-white">
        <h2 className="font-semibold dark:text-white pb-4">
          {t('Pages.Event.Tables.Today')}
        </h2>
        <EventTable
          navigate={navigate}
          data={todaysEvents}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Two divs side by side (50% width on large screens, full width on smaller screens) */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex flex-col w-full lg:w-1/2 h-full rounded-2xl bg-white shadow-lg p-4 dark:bg-gray-900 dark:text-white">
          <h2 className="font-semibold dark:text-white pb-4">
            {t('Pages.Event.Tables.Recent')}
          </h2>
          <EventTable
            navigate={navigate}
            data={recentEvents}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <div className="relative flex flex-col w-full lg:w-1/2 h-full rounded-2xl bg-white shadow-lg p-4 dark:bg-gray-900 dark:text-white">
          <h2 className="font-semibold dark:text-white pb-4">
            {t('Pages.Event.Tables.Upcoming')}
          </h2>
          <EventTable
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
