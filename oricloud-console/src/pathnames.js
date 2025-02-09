const registrationBase = '/signup';

const routes = {
  empty: () => '/',
  about: () => '/about',
  contact: () => '/contact',
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
  resetPassword: () => '/reset-password',
  passwordResetEmailSentPage: () => '/password-reset-email-sent',
  passwordResetConfirmation: () => '/password-reset-confirmation/:userHash',
  getPasswordResetConfirmation: () => '/password-reset-confirmation',
  landing: () => '/landing',
  mrb: () => `${process.env.REACT_APP_BASE_API_URL}/mrb`,
};

export default routes;
