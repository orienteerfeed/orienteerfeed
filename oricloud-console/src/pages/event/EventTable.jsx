import React from 'react';
import { TableFetchState } from '../../molecules';
import { formatDate } from '../../utils';

export const EventTable = ({ t, navigate, data, isLoading, error }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse text-sm text-left">
        <thead className="text-gray-600 dark:text-white">
          <tr className="border-b dark:border-zinc-500">
            <th
              scope="col"
              className="px-2 py-2 font-medium text-gray-900 dark:text-white"
            >
              {t('Pages.Event.Tables.Name')}
            </th>
            <th
              scope="col"
              className="px-2 py-2 font-medium text-gray-900 dark:text-white hidden md:table-cell"
            >
              {t('Pages.Event.Tables.Organiser')}
            </th>
            <th
              scope="col"
              className="px-2 py-2 font-medium text-gray-900 dark:text-white"
            >
              {t('Pages.Event.Tables.Date')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y border-t border-gray-100">
          {typeof data !== 'undefined' && data && data.length > 0 ? (
            data.map((event, index) => (
              <tr
                key={index}
                onClick={() => navigate('/event/' + event.id)}
                className={`hover:bg-gray-200 dark:hover:bg-zinc-500 cursor-pointer transition-colors duration-500 border-b dark:border-gray-700 ${
                  index % 2 === 0
                    ? 'bg-gray-100 dark:bg-zinc-700'
                    : 'bg-white dark:bg-zinc-600'
                }`}
              >
                <td className="flex gap-3 px-2 py-2 font-normal text-gray-900">
                  <div className="text-sm">
                    <div className="font-medium text-gray-700 dark:text-white">
                      {event.name}
                    </div>
                    <div className="text-gray-400">{event.location}</div>
                  </div>
                </td>
                <td className="px-2 py-2 text-gray-700 dark:text-white hidden md:table-cell">
                  {event.organizer}
                </td>
                <td className="px-2 py-2 text-gray-700 dark:text-white">
                  {formatDate(event.date)}
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={3}>
                <TableFetchState isLoading={isLoading} error={error} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
