import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AiOutlineBell, AiOutlineMenu } from 'react-icons/ai';

import { Dropdown, ThemeToggleButton, UserAvatar } from '../molecules';
import { useAuth } from '../utils';
import PATHNAMES from '../pathnames';

export const Navbar = ({ routes, onOpenSidenav, pageName, t }) => {
  const location = useLocation();
  const { token, user, signout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState({
    name: 'Events',
    link: PATHNAMES.empty(),
  });

  useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname, routes]);

  const getActiveRoute = (routes) => {
    let activeRoute;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + '/' + routes[i].path,
        ) !== -1
      ) {
        setCurrentRoute({ name: routes[i].name, link: routes[i].link });
      }
    }
    return activeRoute;
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center md:justify-between rounded-xl bg-white/10 dark:bg-inherit p-2 backdrop-blur-xl justify-end">
      <div className="hidden md:block ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-zinc-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-zinc-700 hover:text-zinc-700 dark:text-white">
              {' '}
              /{' '}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-zinc-700 hover:underline dark:text-white dark:hover:text-white"
            to={currentRoute.link}
          >
            {currentRoute.name}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-zinc-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-zinc-700 dark:hover:text-white"
          >
            {typeof pageName !== 'undefined' ? pageName : currentRoute.name}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-zinc-600 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <div className="flex h-full items-center rounded-full bg-blue-50 text-zinc-700 dark:bg-zinc-800 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl"></p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-blue-50 text-sm font-medium text-zinc-700 outline-none placeholder:!text-gray-400 dark:bg-zinc-800 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <AiOutlineMenu className="dark:text-white" />
        </span>
        {/* start Notification */}
        <Dropdown
          button={
            <p className="cursor-pointer">
              <AiOutlineBell className="dark:text-white" />
            </p>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-zinc-700 dark:text-white dark:shadow-none sm:w-[460px]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-zinc-700 dark:text-white">
                  Notification
                </p>
                <p className="text-sm font-bold text-zinc-700 dark:text-white">
                  Mark all read
                </p>
              </div>

              <button className="flex w-full items-center">
                <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white"></div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                    New Update: Martin Křivda miss punched
                  </p>
                  <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                    A new update for your fav competitor is available!
                  </p>
                </div>
              </button>

              <button className="flex w-full items-center">
                <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white"></div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                    New Update: Tomáš Křivda v cíli
                  </p>
                  <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                    A new update for your fav competitor!
                  </p>
                </div>
              </button>
            </div>
          }
          classNames={'py-2 top-10 -left-[230px] md:-left-[440px] w-max'}
        />
        <ThemeToggleButton />
        {/* Profile & Dropdown */}
        {typeof token !== 'undefined' && token ? (
          <Dropdown
            button={
              <UserAvatar firstName={user.firstname} lastName={user.lastname} />
            }
            children={
              <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-zinc-700 dark:text-white dark:shadow-none">
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-zinc-700 dark:text-white">
                      👋 Hey, {user.firstname}
                    </p>
                  </div>
                </div>
                <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

                <div className="flex flex-col p-4">
                  <Link
                    to={PATHNAMES.profile()}
                    className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                  >
                    {t('Organisms.Navbar.MyProfile')}
                  </Link>
                  <a
                    href=" "
                    className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                  >
                    Notification Settings
                  </a>
                  <button
                    onClick={signout}
                    className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in"
                  >
                    {t('Organisms.Navbar.LogOut')}
                  </button>
                </div>
              </div>
            }
            classNames={'py-2 top-10 -left-[205px] w-max'}
          />
        ) : (
          <Link
            className="px-2 sm:px-4 py-2 rounded-full dark:text-white dark:hover:text-black hover:bg-accent hover:text-accent-foreground transparent transition-colors duration-500"
            to={PATHNAMES.signIn()}
          >
            {t('Organisms.Navbar.SignIn')}
          </Link>
        )}
      </div>
    </nav>
  );
};
