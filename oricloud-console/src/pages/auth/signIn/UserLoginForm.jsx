import React from 'react';
import { Formik } from 'formik';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Label } from '../../../atoms';
import { Field } from '../../../organisms';
import { translatedValidations, useAuth, toast } from '../../../utils';
import { SubmitButton } from '../../../organisms';

import PATHNAMES from '../../../pathnames';

// Define the mutation
const SIGNIN_MUTATION = gql`
  mutation SignIn($input: LoginInput) {
    signin(input: $input) {
      token
      user {
        firstname
        lastname
        email
        id
      }
    }
  }
`;

export const UserLoginForm = ({ t }) => {
  /*   const { data, isLoading, error } = useFetchRequest(
    'https://api.chucknorris.io/jokes/random',
  ); */

  const { object, requiredEmail, requiredString } = translatedValidations(t);
  const { signin } = useAuth();
  const navigate = useNavigate();

  const schema = object({
    email: requiredEmail,
    password: requiredString,
  });

  const [signinMutation] = useMutation(SIGNIN_MUTATION);

  const onSubmitCallback = async ({ email, password }, setSubmitting) => {
    try {
      const response = await signinMutation({
        variables: {
          input: {
            username: email,
            password: password,
          },
        },
      });

      const { token, user } = response.data.signin;
      signin({ token, user });
      console.log('Signup successful:', response);
      navigate(PATHNAMES.empty());
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: 'Ooh! Something went wrong.',
        description: error.message,
        variant: 'destructive',
      });
    }
    setSubmitting(false);
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
