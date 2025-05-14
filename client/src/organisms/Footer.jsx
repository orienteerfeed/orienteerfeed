import React from 'react';
import { Link } from 'react-router-dom';
import PATHNAMES from '../pathnames';

export const Footer = ({ t }) => {
  return (
    <div className="flex w-full flex-col items-center justify-between px-1 pb-2 pt-3 lg:px-8 xl:flex-row">
      <h5 className="mb-1 text-center text-sm font-medium text-gray-600 xl:!mb-0 md:text-lg">
        <p className="mb-1 text-center text-sm text-gray-600 dark:text-gray-400 xl:!mb-0 md:text-base">
          ©{1900 + new Date().getYear()}{' '}
          <Link className="hover:underline" to={PATHNAMES.empty()}>
            Orienteerfeed
          </Link>
          .{' '}
          <Link
            className="hover:underline"
            to="https://www.gnu.org/licenses/gpl-3.0.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Organisms.Footer.LicensedUnderGnuGpl3')}
          </Link>
        </p>
      </h5>
      <div>
        <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
          <li>
            <Link
              to={PATHNAMES.github()}
              className="text-base hover:underline font-medium text-gray-600 dark:text-gray-400 hover:text-gray-600"
            >
              {t('Organisms.Footer.Collaborate')}
            </Link>
          </li>
          <li>
            <Link
              to="https://obpraha.cz/orienteer-feed-docs"
              className="text-base hover:underline font-medium text-gray-600 dark:text-gray-400 hover:text-gray-600"
            >
              {t('Organisms.Footer.Docs')}
            </Link>
          </li>
          <li>
            <Link
              to={PATHNAMES.buyMeCoffee()}
              className="text-base hover:underline font-medium text-gray-600 dark:text-gray-400 hover:text-gray-600"
            >
              {t('Organisms.Footer.Donate')}
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="text-base hover:underline font-medium text-gray-600 dark:text-gray-400 hover:text-gray-600"
            >
              {t('Organisms.Footer.Blog')}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
