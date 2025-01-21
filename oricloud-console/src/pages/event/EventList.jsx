import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TableFetchState } from '../../molecules';
import { useFetchRequest, formatDate } from '../../utils';

import ENDPOINTS from '../../endpoints';

const EventTable = ({ navigate, data, isLoading, error }) => {
  const { t } = useTranslation('translation');
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              {t('Pages.Event.Tables.Name')}
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              {t('Pages.Event.Tables.Organiser')}
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              {t('Pages.Event.Tables.Date')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {typeof data !== 'undefined' && data && data.length > 0 ? (
            data.map((event, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate('/event/' + event.id)}
              >
                <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                  <div className="text-sm">
                    <div className="font-medium text-gray-700">
                      {event.name}
                    </div>
                    <div className="text-gray-400">{event.location}</div>
                  </div>
                </th>
                <td className="px-6 py-4">{event.organizer}</td>
                <td className="px-6 py-4">{formatDate(event.date)}</td>
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
    <>
      <h2>{t('Pages.Event.Tables.Today')}</h2>
      <EventTable
        navigate={navigate}
        data={todaysEvents}
        isLoading={isLoading}
        error={error}
      />
      <h2>{t('Pages.Event.Tables.Recent')}</h2>
      <EventTable
        navigate={navigate}
        data={recentEvents}
        isLoading={isLoading}
        error={error}
      />
      <h2>{t('Pages.Event.Tables.Upcoming')}</h2>
      <EventTable
        navigate={navigate}
        data={upcomingEvents}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
};
