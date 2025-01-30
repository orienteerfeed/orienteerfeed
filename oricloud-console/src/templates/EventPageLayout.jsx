import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AiOutlineBell, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

import { ThemeToggleButton } from '../molecules';
import { useAuth } from '../utils';
import PATHNAMES from '../pathnames';

const routes = [
  { path: '/', name: 'Events' },
  { path: '/landing', name: 'Landing page' },
];

export const EventPageLayout = ({ children, t, pageName }) => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState('Events');

  useEffect(() => {
    window.addEventListener('resize', () =>
      window.innerWidth < 1280 ? setOpen(false) : setOpen(true),
    );
  }, []);

  useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + '/' + routes[i].path,
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar (Fixed Left) */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Main Content Wrapper (Pushed Right) */}
      <div className="flex flex-col flex-1 xl:ml-[325px] bg-blue-50 dark:bg-zinc-800 duration-175">
        {/* Navbar (Fixed Top) */}
        <header className="sticky top-0 left-0 xl:left-[325px] w-full z-40 p-4">
          <Navbar
            onOpenSidenav={() => setOpen(true)}
            logoText={'Horizon UI Tailwind React'}
            brandText={currentRoute}
            pageName={typeof pageName !== 'undefined' ? pageName : currentRoute}
            secondary={getActiveNavbar(routes)}
            t={t}
          />
        </header>

        {/* Main Content (Scrollable) */}
        <main className="flex-grow overflow-auto p-4">
          <div className="container 2xl:max-w-none  mx-auto lg:mx-0 p-2">
            {children}
          </div>
        </main>

        {/* Footer (Always at Bottom) */}
        <footer className="w-full p-4">
          <Footer />
        </footer>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
      <h5 className="mb-1 text-center text-sm font-medium text-gray-600 xl:!mb-0 md:text-lg">
        <p className="mb-1 text-center text-sm text-gray-600 xl:!mb-0 md:text-base">
          ©{1900 + new Date().getYear()} Orienteerfeed. All Rights Reserved.
        </p>
      </h5>
      <div>
        <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
          <li>
            <a
              target="blank"
              href="mailto:hello@simmmple.com"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Support
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="https://simmmple.com/licenses"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              License
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="https://simmmple.com/terms-of-service"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Terms of Use
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="https://blog.horizon-ui.com/"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Blog
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Navbar = ({ onOpenSidenav, brandText, pageName, t }) => {
  const { token, user, signout } = useAuth();

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center md:justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d] justify-end">
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
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-zinc-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-zinc-700 dark:hover:text-white"
          >
            {pageName}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-zinc-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <div className="flex h-full items-center rounded-full bg-blue-50 text-zinc-700 dark:bg-zinc-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl"></p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-blue-50 text-sm font-medium text-zinc-700 outline-none placeholder:!text-gray-400 dark:bg-zinc-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
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
                    New Update: Horizon UI Dashboard PRO
                  </p>
                  <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                    A new update for your downloaded item is available!
                  </p>
                </div>
              </button>

              <button className="flex w-full items-center">
                <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white"></div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                    New Update: Horizon UI Dashboard PRO
                  </p>
                  <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                    A new update for your downloaded item is available!
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
                  <a
                    href=" "
                    className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                  >
                    {t('Organisms.Navbar.MyProfile')}
                  </a>
                  <a
                    href=" "
                    className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                  >
                    Newsletter Settings
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

const useOutsideAlerter = (ref, setX) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setX(false);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, setX]);
};

const Dropdown = ({ button, children, classNames, animation }) => {
  const wrapperRef = useRef(null);
  const [openWrapper, setOpenWrapper] = useState(false);
  useOutsideAlerter(wrapperRef, setOpenWrapper);

  return (
    <div ref={wrapperRef} className="relative flex">
      <div className="flex" onMouseDown={() => setOpenWrapper(!openWrapper)}>
        {button}
      </div>
      <div
        className={`${classNames} absolute z-10 ${
          animation
            ? animation
            : 'origin-top-right transition-all duration-300 ease-in-out'
        } ${openWrapper ? 'scale-100' : 'scale-0'}`}
      >
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({ open, onClose }) => {
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-screen flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-zinc-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? 'translate-x-0' : '-translate-x-96'
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <AiOutlineClose />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        <div className="mt-1 ml-1 h-2.5 text-[26px] font-bold uppercase text-zinc-700 dark:text-white">
          ORIENTEER <span className="font-medium">FEED</span>
        </div>
      </div>
      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <SidebarLinks routes={routes} />
      </ul>

      {/* Nav item end */}
    </div>
  );
};

const SidebarLinks = ({ routes }) => {
  let location = useLocation();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      return (
        <Link key={index} to={route.path}>
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li
              className="my-[3px] flex cursor-pointer items-center px-8"
              key={index}
            >
              <span
                className={`${
                  activeRoute(route.path) === true
                    ? 'font-bold text-brand-500 dark:text-white'
                    : 'font-medium text-gray-600'
                }`}
              >
                {route.icon && route.icon}{' '}
              </span>
              <p
                className={`leading-1 ml-4 flex ${
                  activeRoute(route.path) === true
                    ? 'font-bold text-zinc-700 dark:text-white'
                    : 'font-medium text-gray-600'
                }`}
              >
                {route.name}
              </p>
            </li>
            {activeRoute(route.path) ? (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-zinc-700 dark:bg-zinc-400" />
            ) : null}
          </div>
        </Link>
      );
    });
  };
  // BRAND
  return createLinks(routes);
};

const UserAvatar = ({ firstName, lastName }) => {
  const initials = `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`;

  return (
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-zinc-700 text-white uppercase cursor-pointer">
      {initials}
    </div>
  );
};
