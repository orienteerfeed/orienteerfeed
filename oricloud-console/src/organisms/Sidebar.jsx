import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';

export const Sidebar = ({ routes, open, onClose }) => {
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
                    : 'font-medium text-gray-600 dark:text-gray-400'
                }`}
              >
                {route.icon && route.icon}{' '}
              </span>
              <p
                className={`leading-1 ml-4 flex ${
                  activeRoute(route.path) === true
                    ? 'font-bold text-zinc-700 dark:text-white'
                    : 'font-medium text-gray-600 dark:text-gray-400'
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
