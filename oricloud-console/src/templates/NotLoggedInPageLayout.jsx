import { useLocation } from 'react-router-dom';
import { NotLoggedInNavbar, SideNavigation } from '../organisms';

export const NotLoggedInPageLayout = ({ children, t }) => {
  const location = useLocation();
  return (
    <div className="h-full relative">
      <div className="sm:px-4 w-full z-10 py-8 mb-2">
        <NotLoggedInNavbar />
      </div>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] mx-auto">
        <SideNavigation t={t} location={location} />
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
