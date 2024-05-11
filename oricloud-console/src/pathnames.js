const registrationBase = '/signup';

const routes = {
  empty: () => '/',
  event: () => '/event',
  finance: () => '/finance',
  settings: () => '/settings',
  signIn: () => '/signin',
  signUp: () => `${registrationBase}`,
};

export default routes;
