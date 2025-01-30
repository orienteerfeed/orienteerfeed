import React, { useEffect, useState } from 'react';

import { Footer, Navbar, Sidebar } from '../organisms';

const routes = [
  { path: '/', name: 'Events' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/landing', name: 'Landing page' },
];

export const EventPageLayout = ({ children, t, pageName }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    window.addEventListener('resize', () =>
      window.innerWidth < 1280 ? setOpen(false) : setOpen(true),
    );
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar (Fixed Left) */}
      <Sidebar routes={routes} open={open} onClose={() => setOpen(false)} />

      {/* Main Content Wrapper (Pushed Right) */}
      <div className="flex flex-col flex-1 xl:ml-[325px] bg-blue-50 dark:bg-zinc-800 duration-175">
        {/* Navbar (Fixed Top) */}
        <header className="sticky top-0 left-0 xl:left-[325px] w-full z-40 p-4">
          <Navbar
            routes={routes}
            onOpenSidenav={() => setOpen(true)}
            logoText={'Horizon UI Tailwind React'}
            pageName={pageName}
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
