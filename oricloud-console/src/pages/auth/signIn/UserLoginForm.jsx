import React from 'react';
import { Formik } from 'formik';
import { Label } from '../../../atoms';
import { Field } from '../../../organisms';
import { translatedValidations, useRequest } from '../../../utils';
import { SubmitButton } from '../../../organisms';

export const UserLoginForm = ({ t }) => {
  /*   const { data, isLoading, error } = useFetchRequest(
    'https://api.chucknorris.io/jokes/random',
  ); */

  const request = useRequest();
  const { object, requiredEmail, requiredString } = translatedValidations(t);

  const schema = object({
    email: requiredEmail,
    password: requiredString,
  });

  const onSubmitCallback = async ({ email, password }, setSubmitting) => {
    request.request('https://google.cz', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      onSuccess: () => {
        console.log('mrdat');
      },
      onError: () => console.log('fakju'),
    });
    setTimeout(() => {
      alert(JSON.stringify(email, null, 2));
      setSubmitting(false);
    }, 400);
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmitCallback(values, setSubmitting);
      }}
    >
      {({
        values,
        handleSubmit,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Field
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
              />
            </div>
            {values && values.email && (
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="password">
                  {t('Page.Auth.SignInPage.Password')}
                </Label>
                <Field
                  id="password"
                  name="password"
                  placeholder="Your secret password"
                  type="password"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
            )}
            <SubmitButton variant="default">
              {t('Page.Auth.SignInPage.SignInWithEmail')}
            </SubmitButton>
          </div>
        </form>
      )}
    </Formik>
  );
};
