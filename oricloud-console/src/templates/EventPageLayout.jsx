import { Navbar } from '../organisms';

export const EventPageLayout = ({ children, t }) => {
  return (
    <div className="h-full relative">
      <Navbar />
      <main className="container mx-auto pt-8 px-4 sm:px-0">{children}</main>
    </div>
  );
};
