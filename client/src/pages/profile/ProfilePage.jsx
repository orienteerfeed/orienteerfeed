import React from 'react';
import { useTranslation } from 'react-i18next';
import { EventPageLayout } from '../../templates';
import { Oauth2CredentialsCard } from '.';

export const ProfilePage = () => {
  const { t } = useTranslation();

  return (
    <EventPageLayout t={t}>
      <div className="grid items-start gap-8">
        <Oauth2CredentialsCard />
      </div>
    </EventPageLayout>
  );
};
