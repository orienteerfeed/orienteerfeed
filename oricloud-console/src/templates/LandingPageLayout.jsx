import React from 'react';
import { Link } from 'react-router-dom';

import PATHNAMES from '../pathnames';

export const LandingPageLayout = ({ children, illustrations }) => {
  return (
    <div className="min-h-screen bg-blue-50 text-black relative overflow-hidden">
      {/* Navbar */}
      <header className="flex justify-end xl:justify-between items-center px-8 py-6 border-b border-black relative z-10 bg-blue-50">
        <nav className="hidden xl:flex space-x-8 text-sm uppercase">
          <Link to={PATHNAMES.event()} className="hover:underline">
            Features
          </Link>
          <Link
            to="https://obpraha.cz/orienteer-feed-docs"
            className="hover:underline"
          >
            Docs
          </Link>
          <Link
            to="https://github.com/martinkrivda/orienteerfeed"
            className="hover:underline"
          >
            Collaborate
          </Link>
        </nav>
        <h1 className="absolute left-[50%] transform -translate-x-1/2 font-bold text-2xl tracking-tight">
          <Link to={PATHNAMES.empty()}>ORIENTEERFEED</Link>
        </h1>
        <nav className="flex items-center space-x-6 text-sm uppercase">
          <span className="hidden sm:block">
            <Link to={PATHNAMES.event()} className="hover:underline">
              Launch
            </Link>
          </span>
          <button className="text-xl">&#9776;</button> {/* Menu icon */}
        </nav>
      </header>

      <main className="relative z-10 bg-blue-50">{children}</main>

      {illustrations}
    </div>
  );
};
