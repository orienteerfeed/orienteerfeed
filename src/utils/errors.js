export const formatErrors = (errors) => {
  errors
    .array()
    .map(({ msg, param }) => `${msg}: ${param}`)
    .join(', ');
};
