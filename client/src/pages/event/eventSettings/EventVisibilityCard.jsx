import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import { Card } from '../../../organisms';
import { ToggleSwitch, VisibilityBadge } from '../../../atoms';

import { toast } from '../../../utils';

// GraphQL mutation to update published status
const UPDATE_EVENT_VISIBILITY = gql`
  mutation UpdateEventVisibility($eventId: String!, $published: Boolean!) {
    updateEventVisibility(eventId: $eventId, published: $published) {
      message
      event {
        id
        published
      }
    }
  }
`;

export const EventVisibilityCard = ({ t, eventId, isPublished }) => {
  const [published, setPublished] = useState(isPublished || false);
  const [updateEventVisibility, { loading }] = useMutation(
    UPDATE_EVENT_VISIBILITY,
  );

  const handleToggleEventVisibility = async () => {
    try {
      const { data } = await updateEventVisibility({
        variables: { eventId: eventId, published: !published },
      });

      if (data.updateEventVisibility) {
        setPublished(!published);
        toast({
          title: t('Operations.Success', { ns: 'common' }),
          description: t('Pages.Event.Visibility.Toast.UpdateSuccess', {
            status: published ? 'Private' : 'Public',
          }),
          variant: 'success',
        });
      } else {
        toast({
          title: t('Pages.Event.Visibility.Toast.UpdateFailTitle'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating event visibility:', error);
      toast({
        title: t('Pages.Event.Visibility.Toast.UpdateFailTitle'),
        description: `${error}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      {/* <!-- Event Visibility Toggle Switch Button --> */}
      <Card title={t('Pages.Event.Visibility.Card.Title')}>
        <div className="inline-flex space-x-2">
          <ToggleSwitch
            checked={published}
            onChange={handleToggleEventVisibility}
            disabled={loading}
          />

          {!loading ? (
            <VisibilityBadge t={t} isPublic={published} />
          ) : (
            <span className="text-sm text-gray-500">{t('Loading...')}</span>
          )}
        </div>
      </Card>
    </>
  );
};
