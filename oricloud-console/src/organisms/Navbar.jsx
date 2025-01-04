import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { LanguageSelector, ThemeToggleButton } from '../molecules';
import { useAuth } from '../utils';
import PATHNAMES from '../pathnames';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const { token, user, signout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  // Function to handle clicking outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('#menu') &&
        !event.target.closest('#dropdown-menu')
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="w-full h-20 bg-white justify-center items-start inline-flex">
      <div className="px-8 grow shrink basis-0 self-stretch bg-white/0 shadow justify-between items-center flex">
        <div className="w-96 flex-row justify-start items-center inline-flex gap-2">
          <AiOutlineSearch size={24} />
          <input
            type="text"
            className="w-full bg-transparent pr-4 text-black focus:outline-none xl:w-125"
            placeholder={t('Organism.Navbar.Placeholder')}
          />
        </div>
        <div className="justify-start items-center gap-4 flex">
          <div className="flex-col justify-start items-start inline-flex">
            <LanguageSelector />
          </div>
          <div className="flex-col justify-start items-start inline-flex">
            <ThemeToggleButton />
          </div>

          {typeof token !== 'undefined' && token ? (
            <div className="flex-col justify-start items-start inline-flex">
              <div className="self-stretch justify-start items-center gap-4 inline-flex">
                <div
                  id="menu"
                  onClick={toggleMenu}
                  className="inline-flex flex-row gap-4 items-center slef-stretch cursor-pointer"
                >
                  <div className="flex-col justify-start items-start inline-flex">
                    <div className="self-stretch h-5 flex-col justify-start items-end flex">
                      <div className="text-right text-gray-800 text-sm font-medium leading-tight">
                        {typeof user !== 'undefined' && user && user.firstname}{' '}
                        {typeof user !== 'undefined' && user && user.lastname}
                      </div>
                    </div>
                    <div className="self-stretch h-4 flex-col justify-start items-end flex">
                      <div className="text-right text-slate-500 text-xs font-normal leading-none">
                        K.O.B. Choceň
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full flex-col justify-start items-start inline-flex">
                    <img
                      className="w-12 h-12 relative"
                      src="https://via.placeholder.com/48x48"
                      alt="user-avatar"
                    />
                  </div>
                </div>
              </div>
              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div
                  id="dropdown-menu"
                  className="absolute top-16 right-0 mt-4 flex w-72 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark z-10"
                >
                  <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-6 dark:border-strokedark">
                    <li>
                      <Link
                        className="flex items-center gap-4 font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                        to={PATHNAMES.profile()}
                      >
                        {t('Organism.Navbar.MyProfile')}
                      </Link>
                    </li>
                  </ul>
                  <button
                    onClick={signout}
                    className="flex flex-col gap-5 border-b border-stroke px-6 py-6 dark:border-strokedark"
                  >
                    {t('Organism.Navbar.LogOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                className="px-2 sm:px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transparent transition-colors duration-500"
                to={PATHNAMES.signIn()}
              >
                {t('Organism.Navbar.SignIn')}
              </Link>
              <Link
                className="px-2 sm:px-4 py-2 rounded-md bg-amber-300	hover:text-accent-foreground transparent transition-colors duration-500"
                to={PATHNAMES.signUp()}
              >
                {t('Organism.Navbar.SignUp')}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
