import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AiOutlineSetting } from 'react-icons/ai';
import { BackButton, TableFetchState } from '../../../molecules';
import { EventPageLayout } from '../../../templates';

import { formatDate, useFetchRequest } from '../../../utils';

import ENDPOINTS from '../../../endpoints';
import PATHNAMES from '../../../pathnames';
import { Button, VisibilityBadge } from '../../../atoms';

export const MyEventPage = () => {
  const { t } = useTranslation();
  return (
    <EventPageLayout t={t}>
      <div className="grid items-start gap-8">
        <BackButton t={t} path={PATHNAMES.empty()} />
        <MyEventList t={t} />
      </div>
    </EventPageLayout>
  );
};

const MyEventList = ({ t }) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useFetchRequest(ENDPOINTS.myEvents());

  // Pokud nejsou data k dispozici, vrátíme prázdné pole
  const eventData = data?.results?.data || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Full width event table */}
      <div className="relative flex flex-col w-full h-full rounded-2xl bg-white shadow-lg p-4 dark:bg-zinc-700 dark:text-white">
        <h2 className="font-semibold dark:text-white pb-4">
          {t('Pages.Event.Tables.MyEvents')}
        </h2>
        <MyEventTable
          t={t}
          navigate={navigate}
          data={eventData}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

const MyEventTable = ({ t, navigate, data, isLoading, error }) => {
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
            <th
              scope="col"
              className="px-2 py-2 font-medium text-gray-900 dark:text-white"
            >
              {t('Pages.Event.Tables.Visibility')}
            </th>
            <th
              scope="col"
              className="px-2 py-2 font-medium text-gray-900 dark:text-white"
            >
              {t('Pages.Event.Tables.Edit')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y border-t border-gray-100">
          {typeof data !== 'undefined' && data && data.length > 0 ? (
            data.map((event, index) => (
              <tr
                key={index}
                onClick={() => navigate(PATHNAMES.getEventDetail(event.id))}
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
                <td className="px-2 py-2 text-gray-700 dark:text-white">
                  <VisibilityBadge t={t} isPublic={event.published} />
                </td>
                <td className="px-2 py-2 text-gray-700 dark:text-white">
                  {/* Prevent row click when clicking the button */}
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the row click from firing
                      navigate(PATHNAMES.getEventSettings(event.id));
                    }}
                  >
                    <AiOutlineSetting />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={5}>
                <TableFetchState isLoading={isLoading} error={error} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
