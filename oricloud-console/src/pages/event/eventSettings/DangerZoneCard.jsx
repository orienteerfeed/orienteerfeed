import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../organisms';
import { ButtonWithSpinner } from '../../../molecules';

import { useRequest, toast } from '../../../utils';
import ENDPOINTS from '../../../endpoints';
import PATHNAMES from '../../../pathnames';

export const DangerZoneCard = ({ t, eventId }) => {
  const request = useRequest();
  const navigate = useNavigate();
  // Delete the password (disable access)
  const handleDeleteCompetitors = () => {
    request.request(ENDPOINTS.deleteEventCompetitors(eventId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      onSuccess: (response) => {
        console.log('Event competitors deleted successfully');

        // Optional success notification
        toast({
          title: t('Operations.Success', { ns: 'common' }),
          description: t(
            'Pages.Event.DangerZone.Toast.DeleteSuccessDescription',
          ),
          variant: 'success',
        });
      },
      onError: (err) => {
        console.log('Error:', err);

        if (err.errors && Array.isArray(err.errors)) {
          err.errors.forEach((error) => {
            toast({
              title: t('Pages.Event.Password.Toast.DeleteFailTitle'),
              description: `${error.param}: ${error.msg}`,
              variant: 'destructive',
            });
          });
        } else {
          toast({
            title: t('Pages.Event.DangerZone.Toast.DeleteFailTitle'),
            description: '',
            variant: 'destructive',
          });
        }
      },
    });
  };

  const handleDeleteAllEventData = () => {
    request.request(ENDPOINTS.deleteEventData(eventId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      onSuccess: (response) => {
        console.log('All event data deleted successfully');

        // Optional success notification
        toast({
          title: t('Operations.Success', { ns: 'common' }),
          description: t(
            'Pages.Event.DangerZone.Toast.DeleteSuccessDescription',
          ),
          variant: 'success',
        });
      },
      onError: (err) => {
        console.log('Error:', err);

        if (err.errors && Array.isArray(err.errors)) {
          err.errors.forEach((error) => {
            toast({
              title: t('Pages.Event.DangerZone.Toast.DeleteFailTitle'),
              description: `${error.param}: ${error.msg}`,
              variant: 'destructive',
            });
          });
        } else {
          toast({
            title: t('Pages.Event.DangerZone.Toast.DeleteFailTitle'),
            description: '',
            variant: 'destructive',
          });
        }
      },
    });
  };

  const handleDeleteEvent = () => {
    request.request(ENDPOINTS.deleteEvent(eventId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      onSuccess: (response) => {
        console.log('Event deleted successfully');

        // Optional success notification
        toast({
          title: t('Operations.Success', { ns: 'common' }),
          description: t(
            'Pages.Event.DangerZone.Toast.DeleteSuccessDescription',
          ),
          variant: 'success',
        });
        navigate(PATHNAMES.empty());
      },
      onError: (err) => {
        console.log('Error:', err);

        if (err.errors && Array.isArray(err.errors)) {
          err.errors.forEach((error) => {
            toast({
              title: t('Pages.Event.DangerZone.Toast.DeleteFailTitle'),
              description: `${error.param}: ${error.msg}`,
              variant: 'destructive',
            });
          });
        } else {
          toast({
            title: t('Pages.Event.DangerZone.Toast.DeleteFailTitle'),
            description: '',
            variant: 'destructive',
          });
        }
      },
    });
  };

  return (
    <Card
      title={t('Pages.Event.DangerZone.Title')}
      description={t('Pages.Event.DangerZone.Description')}
    >
      <div className="space-y-4">
        <div className="flex flex-col items-start space-y-2">
          <h3 className="font-semibold">
            {t('Pages.Event.DangerZone.DeleteCompetitors.Title')}
          </h3>
          <p>{t('Pages.Event.DangerZone.DeleteCompetitors.Description')}</p>
          <ButtonWithSpinner
            variant="outline"
            onClick={() => handleDeleteCompetitors()}
          >
            {t('Pages.Event.DangerZone.DeleteCompetitors.Button')}
          </ButtonWithSpinner>
        </div>

        <div className="flex flex-col items-start space-y-2">
          <h3 className="font-semibold">
            {t('Pages.Event.DangerZone.DeleteAllEventData.Title')}
          </h3>
          <p>{t('Pages.Event.DangerZone.DeleteAllEventData.Description')}</p>
          <ButtonWithSpinner
            variant="outline"
            onClick={() => handleDeleteAllEventData()}
          >
            {t('Pages.Event.DangerZone.DeleteAllEventData.Button')}
          </ButtonWithSpinner>
        </div>

        <div className="flex flex-col items-start space-y-2">
          <h3 className="font-semibold text-red-500">
            {t('Pages.Event.DangerZone.DeleteEvent.Title')}
          </h3>
          <p>{t('Pages.Event.DangerZone.DeleteEvent.Description')}</p>
          <ButtonWithSpinner
            variant="destructive"
            onClick={() => handleDeleteEvent()}
          >
            {t('Pages.Event.DangerZone.DeleteEvent.Button')}
          </ButtonWithSpinner>
        </div>

        <div className="flex flex-col items-start space-y-2">
          <h3 className="font-semibold">
            {t('Pages.Event.DangerZone.TroublesShooting.Title')}
          </h3>
          <p>
            {t('Pages.Event.DangerZone.TroublesShooting.Description1')}{' '}
            <a
              href="mailto:support@orienteerfeed.com"
              className="text-blue-500"
            >
              support@orienteerfeed.com
            </a>
            {t('Pages.Event.DangerZone.TroublesShooting.Description2')}
          </p>
        </div>
      </div>
    </Card>
  );
};
