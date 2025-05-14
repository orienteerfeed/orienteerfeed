const registrationBase = '/signup';

const routes = {
  empty: () => '/',
  about: () => '/about',
  contact: () => '/contact',
  feature: () => '/feature',
  getFeature: (feature) => `/feature#${feature}`,
  event: () => '/event',
  myEvents: () => '/my-events',
  eventDetail: () => `/event/:eventId`,
  getEventDetail: (eventId) => `/event/${eventId}`,
  eventReport: () => `/event/:eventId/report`,
  getEventReport: (eventId) => `/event/${eventId}/report`,
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
  mrb: () => `${process.env.REACT_APP_BASE_API_URL}/mrb`,
  buyMeCoffee: () => 'https://buymeacoffee.com/ofeed',
  discord: () => 'https://discord.gg/YWURC23tHZ',
  github: () => 'https://github.com/orienteerfeed/ofeed',
};

export default routes;
