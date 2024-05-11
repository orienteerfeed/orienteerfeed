import { useTranslation } from 'react-i18next';
import { AiOutlinePlus } from 'react-icons/ai';
import { Formik } from 'formik';
import { NotLoggedInPageLayout } from '../../templates';

import { Alert, SimpleDialog, Field, SubmitButton } from '../../organisms';
import { EventTable } from './EventTable';
import { Button, Label } from 'src/atoms';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from 'src/organisms/Dialog';

import { translatedValidations, useRequest } from '../../utils';

export const HomePage = () => {
  const { t } = useTranslation();

  const request = useRequest();
  const { object, boolean, requiredNumber, requiredString, requiredDate } =
    translatedValidations(t);

  const schema = object({
    eventName: requiredString,
    sport: requiredNumber,
    organizer: requiredString,
    date: requiredDate,
    location: requiredString,
    zeroTime: requiredDate,
    relay: boolean,
    published: boolean,
  });

  const onSubmitCallback = async (
    { eventName, sport, organizer, date, location, zeroTime, relay, published },
    setSubmitting,
  ) => {
    request.request('http://localhost:30001/demoEve5nt', {
      method: 'POST',
      body: JSON.stringify({
        name: eventName,
        sport,
        organizer,
        date,
        location,
        zeroTime,
        relay,
        published,
      }),
      onSuccess: () => {
        console.log('mrdat');
      },
      onError: () => console.log('fakju'),
    });
    setTimeout(() => {
      alert(JSON.stringify(eventName, null, 2));
      setSubmitting(false);
    }, 400);
  };

  // TODO: Fetch from database
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  return (
    <NotLoggedInPageLayout t={t}>
      <div className="grid items-start gap-8">
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <h1 className="text-3xl md:text-4xl">{t('Route.Dashboard')}</h1>
            <p className="text-lg text-muted-foreground">
              Manage account and website settings.
            </p>
          </div>
        </div>
        <hr />
        <div className="grid gap-10">
          <Alert
            severity="warning"
            title="This is a demo app."
            className="!pl-14"
          >
            Oricloud console app is a demo app using a Stripe test environment.
            You can find a list of test card numbers on the{' '}
            <a
              href="https://www.kobchocen.cz"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe docs
            </a>
            .
          </Alert>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel
          fermentum enim. Maecenas in cursus mauris. Praesent porta imperdiet
          tellus vitae efficitur. Nunc quis est dolor. Nunc facilisis odio vitae
          magna congue ornare. Ut non ligula lectus. Nam elementum semper
          convallis. Cras bibendum sit amet purus a egestas. Curabitur et
          pharetra sapien, quis malesuada sem. Sed viverra accumsan purus, a
          tempor purus tempus viverra. Mauris nibh mi, tincidunt eget ultrices
          vel, gravida in urna. Aenean molestie ipsum vitae diam congue, id
          auctor enim scelerisque. Morbi ligula elit, pulvinar tincidunt dolor
          eget, vestibulum efficitur risus. Vestibulum ipsum felis, accumsan eu
          sodales eu, hendrerit quis tortor. Integer quis auctor est.
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger>
                <Button>
                  <AiOutlinePlus className="mr-2" />
                  Přidat závod
                </Button>
              </DialogTrigger>
              <DialogContent
                title="Vytvořit závod"
                description="A form na vytvoření nového závodu"
              >
                <Formik
                  initialValues={{
                    eventName: '',
                    sport: '',
                    date: '',
                    organizer: '',
                    location: '',
                    zeroTime: '',
                    relay: '',
                    published: '',
                  }}
                  validationSchema={schema}
                  onSubmit={(values, { setSubmitting }) => {
                    onSubmitCallback(values, setSubmitting);
                  }}
                >
                  {({
                    handleSubmit,
                    /* and other goodies */
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4">
                        <div className="grid gap-1">
                          <Label htmlFor="eventName">Event name</Label>
                          <Field
                            id="eventName"
                            name="eventName"
                            placeholder="Můj první závod"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="none"
                            autoCorrect="off"
                            required
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label htmlFor="sport">Sport</Label>
                          <Field
                            id="sport"
                            name="sport"
                            type="select"
                            options={options}
                            required
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label htmlFor="date">Datum konání</Label>
                          <Field id="date" name="date" type="date" required />
                        </div>
                        <div className="grid gap-1">
                          <Label htmlFor="organizer">Organizer</Label>
                          <Field
                            id="organizer"
                            name="organizer"
                            placeholder="K.O.B. Choceň ❤️"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="none"
                            autoCorrect="off"
                            required
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label htmlFor="location">Location</Label>
                          <Field
                            id="location"
                            name="location"
                            placeholder="Brno-vesnice"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="none"
                            autoCorrect="off"
                            required
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label htmlFor="zeroTime">Zero time</Label>
                          <Field
                            id="zeroTime"
                            name="zeroTime"
                            type="datetime-local"
                            autoCapitalize="none"
                            autoComplete="none"
                            autoCorrect="off"
                            required
                          />
                        </div>
                        <div className="grid gap-1 justify-start">
                          <Label htmlFor="relay">Relay</Label>
                          <Field id="relay" name="relay" type="checkbox" />
                        </div>
                        <div className="grid gap-1 justify-start">
                          <Label htmlFor="published">Published</Label>
                          <Field
                            id="published"
                            name="published"
                            type="checkbox"
                          />
                        </div>
                        <DialogFooter>
                          <SubmitButton variant="default">
                            {t('Page.Auth.SignInPage.SignInWithEmail')}
                          </SubmitButton>
                        </DialogFooter>
                      </div>
                    </form>
                  )}
                </Formik>
              </DialogContent>
            </Dialog>

            <SimpleDialog
              trigger="Open simple dialog"
              title="Open dialog"
              description="Dialog description"
            />
          </div>
          <EventTable />
        </div>
      </div>
    </NotLoggedInPageLayout>
  );
};
