import { Link } from 'react-router-dom';
import { MdArrowBackIosNew } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { UserLoginForm } from './UserLoginForm';
import { LanguageSelector } from '../../../molecules';
import PATHNAMES from '../../../pathnames';
export const SignInPage = () => {
  const { t } = useTranslation(['translation', 'common']);
  return (
    <div className="min-h-screen">
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <Link
          to={PATHNAMES.empty()}
          className="absolute left-4 top-4 md:left-8 md:top-8"
        >
          <div className="flex items-center">
            <MdArrowBackIosNew className="mr-2 h-4 w-4" />
            {t('Back', { ns: 'common' })}
          </div>
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[430px] p-4 md:px-6 py-12 rounded">
          <div className="self-end mb-8">
            <LanguageSelector />
          </div>
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('Pages.Auth.SignInUpPage.WelcomeBack')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('Pages.Auth.SignInUpPage.EnterYourEmailToSignIn')}
            </p>
            <div className="grid gap-6">
              <UserLoginForm t={t} />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('Or', { ns: 'common' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              to={PATHNAMES.signUp()}
              className="hover:text-brand underline underline-offset-4"
            >
              {t('Pages.Auth.SignInUpPage.DontHaveAnAccount')}{' '}
              {t('Pages.Auth.SignInUpPage.SignUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
