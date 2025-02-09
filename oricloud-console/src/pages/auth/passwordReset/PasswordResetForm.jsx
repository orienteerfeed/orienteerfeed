import React from 'react';
import { Formik } from 'formik';
import { gql, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Label } from '../../../atoms';
import { Field } from '../../../organisms';
import { translatedValidations, toast, useAuth } from '../../../utils';
import { SubmitButton } from '../../../organisms';

import PATHNAMES from '../../../pathnames';

// Define the mutation
const PASSWORD_RESET_MUTATION = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      token
      user {
        id
        firstname
        lastname
        email
      }
    }
  }
`;

export const PasswordResetForm = ({ t }) => {
  const { object, passwordsDontMatch, requiredString } =
    translatedValidations(t);
  const navigate = useNavigate();
  const { userHash } = useParams();
  const { signin } = useAuth();

  const schema = object({
    password: requiredString,
    passwordConfirmation: passwordsDontMatch('password'),
  });

  const [resetPassword] = useMutation(PASSWORD_RESET_MUTATION);

  const onSubmitCallback = async ({ password }, setSubmitting) => {
    try {
      const response = await resetPassword({
        variables: {
          token: userHash,
          newPassword: password,
        },
      });

      const { token, user } = response.data.resetPassword;

      signin({ token, user });
      console.log('Password reset successful:', response);
      navigate(PATHNAMES.empty());
    } catch (error) {
      console.error('Error reset password:', error);
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
      initialValues={{ password: '', passwordConfirmation: '' }}
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
              <Label className="sr-only" htmlFor="password">
                {t('Pages.Auth.User.Password')}
              </Label>
              <Field
                id="password"
                name="password"
                placeholder={t('Pages.Auth.User.Placeholder.NewPassword')}
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
              />
            </div>
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="passwordConfirmation">
                {t('Pages.Auth.User.PasswordConfirmation')}
              </Label>
              <Field
                id="passwordConfirmation"
                name="passwordConfirmation"
                placeholder={t(
                  'Pages.Auth.User.Placeholder.PasswordConfirmation',
                )}
                type="password"
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect="off"
              />
            </div>
            <SubmitButton variant="default">
              {t('Pages.Auth.RequestPasswordResetPage.ResetPassword')}
            </SubmitButton>
          </div>
        </form>
      )}
    </Formik>
  );
};
