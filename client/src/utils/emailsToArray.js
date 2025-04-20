export const emailsStringToEmailArray = (emails) =>
  emails
    .split(',')
    .map((email) => email.trim())
    .filter((email) => !!email);
