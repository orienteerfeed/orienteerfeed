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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: t('Operations.Success', { ns: 'common' }),
      description: t('Pages.Event.Password.Toast.CopySuccessDescription'),
      variant: 'success',
    });
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
        const newPassword = response.results.data.password;
        // Update the local state with the new password and expiration from the response
        setPassword(newPassword);
        setExpiration(new Date(response.results.data.expiresAt).getTime());
        onPasswordUpdate(newPassword); // Notify parent of updated password

        console.log('Password updated successfully');

        // Optional success notification
        toast({
          title: t('Operations.Success', { ns: 'common' }),
          description: t('Pages.Event.Password.Toast.UpdateSuccessDescription'),
          variant: 'success',
        });
      },
      onError: (err) => {
        console.log('Error:', err);

        if (err.errors && Array.isArray(err.errors)) {
          err.errors.forEach((error) => {
            toast({
              title: t('Pages.Event.Password.Toast.UpdateFailTitle'),
              description: `${error.param}: ${error.msg}`,
              variant: 'destructive',
            });
          });
        } else {
          toast({
            title: t('Pages.Event.Password.Toast.UpdateFailTitle'),
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
          description: t('Pages.Event.Password.Toast.RevokeSuccessDescription'),
          variant: 'success',
        });
        onPasswordUpdate && onPasswordUpdate(''); // Notify parent component that the password is removed
      },
      onError: (err) => {
        console.log('Error:', err);

        if (err.errors && Array.isArray(err.errors)) {
          err.errors.forEach((error) => {
            toast({
              title: t('Pages.Event.Password.Toast.RevokeFailTitle'),
              description: `${error.param}: ${error.msg}`,
              variant: 'destructive',
            });
          });
        } else {
          toast({
            title: t('Pages.Event.Password.Toast.RevokeFailTitle'),
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
              <Label htmlFor="event-password">
                {t('Pages.Event.Password.Field.Name')}
              </Label>
              <div className="relative">
                <Field
                  id="event-password"
                  name="event-password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={password || ''} // Ensure it's never undefined
                  placeholder={t(
                    'Pages.Event.Password.Field.Placeholders.Name',
                  )}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  readOnly
                />
                {/* Copy Button */}
                {password && (
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 outline-solid outline-1 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
                  >
                    {t('Pages.Event.Password.Copy')}
                  </button>
                )}

                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2 dark:text-white"
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
                {password
                  ? t('Pages.Event.Password.RegeneratePassword')
                  : t('Pages.Event.Password.GeneratePassword')}
              </Button>
            </div>

            <div className="flex flex-row items-center">
              <div className="grid gap-1 flex-grow-0 basis-4/5">
                <Label>{t('Pages.Event.Password.PassportExpiration')}</Label>
                {/* Pass the expiration state to CountdownTimer */}
                {expiration ? (
                  <CountdownTimer expiryDate={new Date(expiration)} />
                ) : (
                  <p>{t('Pages.Event.Password.NoExpirationSet')}</p>
                )}
              </div>
              {/* Delete/Disable Password Button */}
              {password && (
                <Button
                  type="button"
                  className="bg-red-500 text-white flex-grow-1 basis-1/5"
                  onClick={handleDeletePassword}
                >
                  {t('Pages.Event.Password.Revoke')}
                </Button>
              )}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};
