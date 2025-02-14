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
      title="Danger Zone"
      description="Destroy all competitors and classes related to your event permanently."
    >
      <div className="space-y-4">
        <div className="flex flex-col items-start space-y-2">
          <h3 className="font-semibold">Delete competitors</h3>
          <p>
            If you uploaded Start list or Results for a wrong event, you can
            delete all competitors and start over. This button deletes all
            runners (Start list & Results).
          </p>
          <ButtonWithSpinner
            variant="outline"
            onClick={() => handleDeleteCompetitors()}
          >
            Delete competitors
          </ButtonWithSpinner>
        </div>

        <div className="flex flex-col items-start space-y-2">
          <h3 className="font-semibold">Delete all event data</h3>
          <p>
            If you need to completely remove all event data, including runners,
            classes, and results, use this button. Be cautious, as this action
            is irreversible.
          </p>
          <ButtonWithSpinner
            variant="outline"
            onClick={() => handleDeleteAllEventData()}
          >
            Delete all event data
          </ButtonWithSpinner>
        </div>

        <div className="flex flex-col items-start space-y-2">
          <h3 className="font-semibold text-red-500">Delete event</h3>
          <p>All event data will be deleted. This action cannot be undone.</p>
          <ButtonWithSpinner
            variant="destructive"
            onClick={() => handleDeleteEvent()}
          >
            Delete event
          </ButtonWithSpinner>
        </div>

        <div className="flex flex-col items-start space-y-2">
          <h3 className="font-semibold">Experiencing problems?</h3>
          <p>
            Describe your difficulties to{' '}
            <a
              href="mailto:support@orienteerfeed.com"
              className="text-blue-500"
            >
              support@orienteerfeed.com
            </a>
            , please include any relevant files.
          </p>
        </div>
      </div>
    </Card>
  );
};
