const registrationBase = '/signup';

const routes = {
  empty: () => '/',
  event: () => '/event',
  eventDetail: () => `/event/:eventId`,
  getEventDetail: (eventId) => `/event/${eventId}`,
  eventSettings: () => `/event/:eventId/settings`,
  getEventSettings: (eventId) => `/event/${eventId}/settings`,
  classDetail: (eventId, classId) => `/event/${eventId}/class/${classId}`,
  finance: () => '/finance',
  profile: () => '/profile',
  settings: () => '/settings',
  signIn: () => '/signin',
  signUp: () => `${registrationBase}`,
  landing: () => '/landing',
};

export default routes;
