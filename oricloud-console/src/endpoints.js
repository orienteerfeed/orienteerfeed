const apiPrefix = '/rest/v1';

const apiEndpoints = {
  // auth
  signIn: () => `${apiPrefix}/auth/signin`,
  signUp: () => `${apiPrefix}/auth/signup`,
  fetchOAuth2Credentials: () => `${apiPrefix}/auth/oauth2-credentials`,
  generateOAuth2Credentials: () =>
    `${apiPrefix}/auth/generate-oauth2-credentials`,

  // event
  events: () => `${apiPrefix}/events`,
  eventDetail: (eventId) => `${apiPrefix}/events/${eventId}`,
  generateEventPassword: () => `${apiPrefix}/events/generate-password`,
  revokeEventPassword: () => `${apiPrefix}/events/revoke-password`,
  uploadIofXml: () => `${apiPrefix}/upload/iof`,
};

export default apiEndpoints;
