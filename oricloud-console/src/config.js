export const config = {
  REQUEST_LOGGING: process.env.REACT_APP_REQUEST_LOGGING === 'true',
  I18N_LOGGING: process.env.REACT_APP_I18N_LOGGING === 'true',
  BASE_API_URL: process.env.REACT_APP_BASE_API_URL,
  PUBLIC_URL: process.env.REACT_APP_PUBLIC_URL,
};
