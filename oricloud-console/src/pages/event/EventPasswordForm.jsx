import React, { useState } from 'react';
import { Formik } from 'formik';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';

import { CountdownTimer, Field } from '../../organisms';
import { Label, Button } from '../../atoms'; // Assuming you have these components
import { useRequest, toast } from '../../utils';

import ENDPOINTS from '../../endpoints';

export const EventPasswordForm = ({
  t,
  eventId,
  onPasswordUpdate,
  password: decryptedPassword,
  expiresAt,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState(decryptedPassword || '');
  const [expiration, setExpiration] = useState(
    expiresAt ? new Date(parseInt(expiresAt, 10)) : null,
  );

  const request = useRequest();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Generate a new password and set expiration
  const handleGeneratePassword = () => {
    // Send the generated password and expiration to the server
    request.request(ENDPOINTS.generateEventPassword(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
      }),
      onSuccess: (response) => {
        // Update the local state with the new password and expiration from the response
        setPassword(response.results.data.password);
        setExpiration(new Date(response.results.data.expiresAt).getTime());

        console.log('Password updated successfully');

        // Optional success notification
        toast({
          title: t('Operations.Success', { ns: 'common' }),
          description: t('Page.Event.Password.Toast.UpdateSuccessDescription'),
          variant: 'success',
        });
      },
      onError: (err) => {
        console.log('Error:', err);

        if (err.errors && Array.isArray(err.errors)) {
          err.errors.forEach((error) => {
            toast({
              title: t('Page.Event.Password.Toast.UpdateFailTitle'),
              description: `${error.param}: ${error.msg}`,
              variant: 'destructive',
            });
          });
        } else {
          toast({
            title: t('Page.Event.Password.Toast.UpdateFailTitle'),
            description: '',
            variant: 'destructive',
          });
        }
      },
    });
  };

  // Delete the password (disable access)
  const handleDeletePassword = () => {
    // Send the generated password and expiration to the server
    request.request(ENDPOINTS.revokeEventPassword(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
      }),
      onSuccess: (response) => {
        // Update the local state with the new password and expiration from the response
        setPassword('');
        setExpiration(null);

        console.log('Password revoked successfully');

        // Optional success notification
        toast({
          title: t('Operations.Success', { ns: 'common' }),
          description: t('Page.Event.Password.Toast.RevokeSuccessDescription'),
          variant: 'success',
        });
        onPasswordUpdate && onPasswordUpdate(''); // Notify parent component that the password is removed
      },
      onError: (err) => {
        console.log('Error:', err);

        if (err.errors && Array.isArray(err.errors)) {
          err.errors.forEach((error) => {
            toast({
              title: t('Page.Event.Password.Toast.RevokeFailTitle'),
              description: `${error.param}: ${error.msg}`,
              variant: 'destructive',
            });
          });
        } else {
          toast({
            title: t('Page.Event.Password.Toast.RevokeFailTitle'),
            description: '',
            variant: 'destructive',
          });
        }
      },
    });
  };

  return (
    <Formik
      initialValues={{ password }}
      onSubmit={() => {
        // Handle form submission logic
        //toast.success('Password submitted!');
      }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="event-password">{t('Page.Event.Password.Field.Name')}</Label>
              <div className="relative">
                <Field
                  id="event-password"
                  name="event-password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={password || ''} // Ensure it's never undefined
                  placeholder={t('Page.Event.Password.Field.Placeholders.Name')}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  readOnly
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2"
                >
                  {passwordVisible ? (
                    <AiOutlineEyeInvisible name="eye-slash" /> // Assuming you have an eye icon for visibility toggle
                  ) : (
                    <AiOutlineEye name="eye" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-1">
              <Button type="button" onClick={handleGeneratePassword}>
                {password ? t('Page.Event.Password.RegeneratePassword') : t('Page.Event.Password.GeneratePassword')}
              </Button>
            </div>

            <div className="flex flex-row items-center">
              <div className="grid gap-1 flex-grow-0 basis-4/5">
                <Label>{t('Page.Event.Password.PassportExpiration')}</Label>
                {/* Pass the expiration state to CountdownTimer */}
                {expiration ? (
                  <CountdownTimer expiryDate={new Date(expiration)} />
                ) : (
                  <p>{t('Page.Event.Password.NoExpirationSet')}</p>
                )}
              </div>
              {/* Delete/Disable Password Button */}
              {password && (
                <Button
                  type="button"
                  className="bg-red-500 text-white flex-grow-1 basis-1/5"
                  onClick={handleDeletePassword}
                >
                  {t('Page.Event.Password.Revoke')}
                </Button>
              )}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};
