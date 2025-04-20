import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Card, Field } from '../../organisms';
import { Label, Button } from '../../atoms'; // Assuming you have these components
import { useTranslation } from 'react-i18next';

import { useFetchRequest, useRequest, toast } from '../../utils';

import ENDPOINTS from '../../endpoints';

export const OAuth2CredentialsForm = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [clientSecretVisible, setClientSecretVisible] = useState(false);
  const [maskSecret, setMaskSecret] = useState(true);

  const request = useRequest();
  const { data } = useFetchRequest(ENDPOINTS.fetchOAuth2Credentials());
  const { t } = useTranslation();

  // Function to toggle secret visibility
  const toggleClientSecretVisibility = () => {
    setClientSecretVisible(!clientSecretVisible);
  };

  // Get masked secret (replace with actual masking logic if needed)
  const getMaskedSecret = () => {
    return '••••••••••••••••••••';
  };

  // Function to regenerate client secret
  const handleRegenerateSecret = async () => {
    request.request(ENDPOINTS.generateOAuth2Credentials(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grants: 'client_credentials',
      }),
      onSuccess: (response) => {
        // Update the local state with the new password and expiration from the response
        setClientId(response.results.data.client_id);
        setClientSecret(response.results.data.client_secret);
        setMaskSecret(false);
        setClientSecretVisible(true);

        // Optional success notification
        toast({
          title: t('Operations.Success', { ns: 'common' }),
          description: t(
            'Pages.Profile.OAuth2CredentialsForm.Toast.GenerateSuccessDescription',
          ),
          variant: 'success',
        });
      },
      onError: (err) => {
        console.log('Error:', err);

        if (err.errors && Array.isArray(err.errors)) {
          err.errors.forEach((error) => {
            toast({
              title: t(
                'Pages.Profile.OAuth2CredentialsForm.Toast.GenerateFailTitle',
              ),
              description: `${error.param}: ${error.msg}`,
              variant: 'destructive',
            });
          });
        } else {
          toast({
            title: t(
              'Pages.Profile.OAuth2CredentialsForm.Toast.GenerateFailTitle',
            ),
            description: '',
            variant: 'destructive',
          });
        }
      },
    });
  };

  // Function to delete/revoke credentials
  const handleDeleteCredentials = async () => {
    try {
      await request.delete(ENDPOINTS.revokeCredentials(clientId)); // API call to revoke credentials
      setClientId('');
      setClientSecret('');
      toast({
        title: t('Operations.Success', { ns: 'common' }),
        description: t(
          'Pages.Profile.OAuth2CredentialsForm.Toast.RevokeSuccessDescription',
        ),
        variant: 'success',
      });
    } catch (error) {
      console.error('Error revoking credentials', error);
      toast({
        title: t('Pages.Profile.OAuth2CredentialsForm.Toast.RevokeFailTitle'),
        description: `${error.param}: ${error.msg}`,
        variant: 'destructive',
      });
    }
  };

  // useEffect to update state when data is available or changes
  useEffect(() => {
    if (data && data.results && data.results.data) {
      const fetchedClientId = data.results.data.clientId;

      // Only update if the values are different
      if (!clientId) {
        setClientId(fetchedClientId);
      }
    }
  }, [data, clientId]); // Dependencies for the useEffect

  return (
    <Formik
      initialValues={{ clientId, clientSecret }}
      onSubmit={() => {
        // Handle form submission logic if needed
      }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {/* Client ID */}
            <div className="grid gap-1">
              <Label htmlFor="client-id">
                {t('Pages.Profile.OAuth2CredentialsForm.ClientId')}
              </Label>
              <Field
                id="client-id"
                name="client-id"
                type="text"
                value={clientId}
                placeholder="Client ID"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                readOnly
              />
            </div>

            {/* Client Secret */}
            <div className="grid gap-1">
              <Label htmlFor="client-secret">
                {t('Pages.Profile.OAuth2CredentialsForm.ClientSecret')}
              </Label>
              <div className="relative">
                <Field
                  id="client-secret"
                  name="client-secret"
                  type={clientSecretVisible ? 'text' : 'password'} // Password input by default
                  value={
                    clientSecretVisible
                      ? maskSecret
                        ? getMaskedSecret()
                        : clientSecret
                      : getMaskedSecret()
                  } // Show full if first time, else mask
                  placeholder="Client Secret"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  readOnly
                />
                <button
                  type="button"
                  onClick={toggleClientSecretVisibility}
                  className="absolute right-2 top-2"
                >
                  {clientSecretVisible ? (
                    <AiOutlineEyeInvisible name="eye-slash" /> // Hide icon
                  ) : (
                    <AiOutlineEye name="eye" /> // Show icon
                  )}
                </button>
              </div>
            </div>

            {/* Regenerate Client Secret Button */}
            <div className="grid gap-1">
              <Button type="button" onClick={handleRegenerateSecret}>
                {t('Pages.Profile.OAuth2CredentialsForm.Regenerate')}
              </Button>
            </div>

            {/* Countdown Timer and Disable Button */}
            <div className="flex flex-row items-center">
              {clientSecret && (
                <Button
                  type="button"
                  className="bg-red-500 text-white flex-grow-1 basis-1/5"
                  onClick={handleDeleteCredentials}
                >
                  {t('Pages.Profile.OAuth2CredentialsForm.Revoke')}
                </Button>
              )}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export const Oauth2CredentialsCard = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* <!-- Event Form --> */}
      <Card
        title={t('Pages.Profile.OAuth2CredentialsForm.Card.Title')}
        description={t('Pages.Profile.OAuth2CredentialsForm.Card.Description')}
      >
        <OAuth2CredentialsForm />
      </Card>
    </>
  );
};
