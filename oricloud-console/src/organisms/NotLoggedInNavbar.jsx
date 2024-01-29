import { Link } from 'react-router-dom';
import PATHNAMES from '../pathnames';

export const NotLoggedInNavbar = () => {
  return (
    <div
      className="flex justify-between items-center rounded-full mx-auto py-3 px-12 lg:w-8/12 sm:px-16 sm:w-full shadow-2xl"
      role="navigation"
    >
      <nav className="flex items-center">
        <Link
          className="px-2 sm:px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transparent transparent transition-colors duration-500"
          to={PATHNAMES.empty()}
        >
          Logo
        </Link>
        <div className="invisible sm:visible">
          <Link
            className="px-2 sm:px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transparent transparent transition-colors duration-500"
            to={PATHNAMES.empty()}
          >
            Menu1
          </Link>
          <Link
            className="px-2 sm:px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transparent transparent transition-colors duration-500"
            to={PATHNAMES.empty()}
          >
            Menu2
          </Link>
        </div>
      </nav>
      <div className="flex">
        <Link
          className="px-2 sm:px-4 py-2 mx-1 rounded-md hover:bg-accent hover:text-accent-foreground transparent transition-colors duration-500"
          to={PATHNAMES.signIn()}
        >
          SignIn
        </Link>
        <Link
          className="px-2 sm:px-4 py-2 mx-1 rounded-md bg-amber-300	hover:text-accent-foreground transparent transition-colors duration-500"
          to={PATHNAMES.signUp()}
        >
          SignUp
        </Link>
      </div>
    </div>
  );
};
