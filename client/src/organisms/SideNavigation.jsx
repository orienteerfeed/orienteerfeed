import {
  MdOutlineHome,
  MdOutlineSettings,
  MdOutlineCalendarMonth,
} from 'react-icons/md';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PATHNAMES from '../pathnames';
export const SideNavigation = ({ t, location }) => {
  return (
    <aside className="hidden w-[200px] flex-col md:flex">
      <nav className="grid items-start gap-2">
        <Link to={PATHNAMES.empty()}>
          <span
            className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transparent 
          ${location.pathname === PATHNAMES.empty() && 'bg-accent'}`}
          >
            <MdOutlineHome className="mr-2 h-4 w-4" />
            <span>{t('Route.Dashboard')}</span>
          </span>
        </Link>
        <Link to={PATHNAMES.event()}>
          <span
            className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transparent 
          ${location.pathname === PATHNAMES.event() && 'bg-accent'}`}
          >
            <MdOutlineCalendarMonth className="mr-2 h-4 w-4" />
            <span>{t('Route.Events')}</span>
          </span>
        </Link>
        <Link to={PATHNAMES.finance()}>
          <span
            className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transparent 
          ${location.pathname === PATHNAMES.finance() && 'bg-accent'}`}
          >
            <FaRegMoneyBillAlt className="mr-2 h-4 w-4" />
            <span>{t('Route.Finances')}</span>
          </span>
        </Link>
        <Link to={PATHNAMES.settings()}>
          <span
            className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transparent ${
              location.pathname === PATHNAMES.finance() && 'bg-accent'
            }`}
          >
            <MdOutlineSettings className="mr-2 h-4 w-4" />
            <span>{t('Route.Settings')}</span>
          </span>
        </Link>
      </nav>
    </aside>
  );
};
