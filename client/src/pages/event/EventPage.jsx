import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '../../atoms';
import { Alert } from '../../organisms';
import { EventPageLayout } from '../../templates';
import { useAuth } from '../../utils';

import { CreateEventDialog } from './CreateEventDialog';
import { EventList } from './EventList';

import PATHNAMES from '../../pathnames';

export const EventPage = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const navigate = useNavigate();

  return (
    <EventPageLayout t={t}>
      <div className="grid items-start gap-8">
        {typeof token !== 'undefined' && token && (
          <div className="flex justify-end space-x-2">
            <Button onClick={() => navigate(PATHNAMES.myEvents())}>
              {t('Pages.Event.Tables.MyEvents')}
            </Button>
            <CreateEventDialog t={t} />
          </div>
        )}
        <Alert
          variant="filled"
          severity="warning"
          title={t('Pages.Event.Alert.DemoTitle')}
          className="!pl-14"
        >
          {t('Pages.Event.Alert.DemoDescription')}
        </Alert>
        <EventList />
      </div>
    </EventPageLayout>
  );
};
