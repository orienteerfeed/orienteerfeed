import React, { useEffect, useState } from 'react';

import { Footer, Navbar, Sidebar } from '../organisms';
import PATHNAMES from '../pathnames';

const MENU_EXPAND_THRESHOLD = 1280;

const routes = [
  { path: PATHNAMES.empty(), name: 'Home' },
  { path: PATHNAMES.event(), name: 'Events' },
  { path: PATHNAMES.about(), name: 'About' },
  { path: PATHNAMES.contact(), name: 'Contact' },
  { path: PATHNAMES.mrb(), name: 'MyResultBoard' },
];

export const EventPageLayout = ({ children, t, pageName }) => {
  const [open, setOpen] = useState(
    window.innerWidth > MENU_EXPAND_THRESHOLD ? true : false,
  );

  useEffect(() => {
    window.addEventListener('resize', () =>
      window.innerWidth < MENU_EXPAND_THRESHOLD
        ? setOpen(false)
        : setOpen(true),
    );
  }, []);

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar (Fixed Left) */}
      <Sidebar routes={routes} open={open} onClose={() => setOpen(false)} />

      {/* Main Content Wrapper (Pushed Right) */}
      <div className="flex flex-col flex-1 xl:ml-[325px] bg-blue-50 dark:bg-zinc-800 duration-175">
        {/* Navbar (Fixed Top) */}
        <header className="sticky top-0 left-0 xl:left-[325px] w-full z-40 p-1 md:p-4">
          <Navbar
            routes={routes}
            onOpenSidenav={() => setOpen(true)}
            logoText={'Orienteerfeed'}
            pageName={pageName}
            t={t}
          />
        </header>

        {/* Main Content (Scrollable) */}
        <main className="flex-grow overflow-auto p-1 md:p-4">
          <div className="container 2xl:max-w-none  mx-auto lg:mx-0 p-2">
            {children}
          </div>
        </main>

        {/* Footer (Always at Bottom) */}
        <footer className="w-full p-1 md:p-4">
          <Footer />
        </footer>
      </div>
    </div>
  );
};
