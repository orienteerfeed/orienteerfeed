import React from 'react';
import { Formik } from 'formik';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Label } from '../../../atoms';
import { Field } from '../../../organisms';
import { translatedValidations, toast } from '../../../utils';
import { SubmitButton } from '../../../organisms';
import { config } from '../../../config';

import PATHNAMES from '../../../pathnames';

// Define the mutation
const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      message
    }
  }
`;

export const RequestPasswordResetForm = ({ t }) => {
  const { object, requiredEmail } = translatedValidations(t);
  const navigate = useNavigate();

  const schema = object({
    email: requiredEmail,
  });

  const [requestPasswordReset] = useMutation(REQUEST_PASSWORD_RESET_MUTATION);

  const onSubmitCallback = async ({ email }, setSubmitting) => {
    try {
      const response = await requestPasswordReset({
        variables: {
          email: email,
        },
        context: {
          headers: {
            'x-ofeed-app-reset-password-url':
              config.PUBLIC_URL + PATHNAMES.getPasswordResetConfirmation(),
          },
        },
      });

      console.log('Password reset request successful:', response);
      navigate(PATHNAMES.passwordResetEmailSentPage());
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
      initialValues={{ email: '' }}
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
              <Label className="sr-only" htmlFor="email">
                {t('Pages.Auth.User.Email')}
              </Label>
              <Field
                id="email"
                name="email"
                placeholder={t('Pages.Auth.User.Placeholder.Email')}
                type="email"
                autoCapitalize="none"
                autoComplete="email"
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
