import React from 'react';
import { Link } from 'react-router-dom';
import PATHNAMES from '../../pathnames';

export const NotAuthorizedPage = () => {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-red-600">403</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Forbidden
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Not for your eyes. You don’t have permission to view this page.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to={PATHNAMES.empty()}
            className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
};
