import React from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBackIosNew } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import PATHNAMES from '../../../pathnames';

export const PasswordResetEmailSentPage = () => {
  const { t } = useTranslation(['translation', 'common']);

  return (
    <div className="min-h-screen">
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        {/* Back Button */}
        <Link
          to={PATHNAMES.empty()}
          className="absolute left-4 top-4 md:left-8 md:top-8"
        >
          <div className="flex items-center">
            <MdArrowBackIosNew className="mr-2 h-4 w-4" />
            {t('Back', { ns: 'common' })}
          </div>
        </Link>

        {/* Main Content */}
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[700px] p-4 md:px-6 py-12 rounded">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
            {t('Pages.Auth.PasswordResetEmailSentPage.CheckYourEmail')}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            {t(
              'Pages.Auth.PasswordResetEmailSentPage.PasswordResetInstructions1',
            )}
          </p>

          <p className="text-center text-gray-600 dark:text-gray-300">
            {t(
              'Pages.Auth.PasswordResetEmailSentPage.PasswordResetInstructions2',
            )}
          </p>

          <p className="text-center text-gray-600 dark:text-gray-300">
            {t(
              'Pages.Auth.PasswordResetEmailSentPage.PasswordResetInstructions3',
            )}
          </p>

          {/* Optionally, you can add a button to redirect users to the login page */}
          <div className="flex justify-center mt-6">
            <Link
              to={PATHNAMES.signIn()}
              className="text-blue-600 hover:text-blue-800"
            >
              {t('Go to Login')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
