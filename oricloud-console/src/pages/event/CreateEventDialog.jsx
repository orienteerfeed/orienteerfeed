import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

import { Button } from '../../atoms';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from 'src/organisms/Dialog';
import { SubmitButton } from '../../organisms';

import { EventForm } from '.';

export const CreateEventDialog = ({ t, initialData = null }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <AiOutlinePlus className="mr-2" />
          {t('Pages.Event.Oprations.CreateEvent')}
        </Button>
      </DialogTrigger>
      <DialogContent
        title={
          initialData
            ? t('Pages.Event.Oprations.EditEvent')
            : t('Pages.Event.Oprations.CreateEvent')
        }
        description={
          initialData
            ? t('Pages.Event.Oprations.EditDescription')
            : t('Pages.Event.Oprations.CreateDescription')
        }
      >
        <EventForm
          t={t}
          initialData={initialData}
          renderSubmitButton={({ isSubmitting }) => (
            <DialogFooter>
              <SubmitButton isSubmitting={isSubmitting}>
                {t('Operations.Submit', { ns: 'common' })}
              </SubmitButton>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  );
};
