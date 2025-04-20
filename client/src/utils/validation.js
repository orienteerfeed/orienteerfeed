import * as yup from 'yup';

import { emailsStringToEmailArray } from './';

export const translatedValidations = (t) => ({
  email: email(t),
  requiredString: requiredString(t),
  number: number(t),
  requiredNumber: requiredNumber(t),
  requiredEmail: requiredEmail(t),
  requiredCsosRegNum: requiredCsosRegNum(t),
  passwordsDontMatch: passwordsDontMatch(t),
  object: (obj) => yup.object().shape(obj),
  requiredDate: requiredDate(t),
  url: url(t),
  time: time(t),
  requiredTime: requiredTime(t),
  uniqueMinMaxEmails: uniqueMinMaxEmails(t),
  boolean: boolean(),
  fileRequired: fileRequired(t),
  fileRequiredPdf: fileRequiredPdf(t),
  requiredArrayOfNumbers: requiredArrayOfNumbers(t),
  gpsLatitude: gpsLatitude(t),
  gpsLongitude: gpsLongitude(t),
});

const string = () => yup.string().nullable();

const boolean = () => yup.boolean();

const array = () => yup.array();

const number = (t) =>
  yup.number().nullable(true).typeError(t('Validations.Number'));

const date = (t) => yup.date().typeError(t('Validations.Date'));

const url = () => string().url().nullable();

const requiredString = (t) => string().required(t('Validations.Required'));

const requiredNumber = (t) => number(t).required(t('Validations.Required'));

const email = (t) => string().email(t('Validations.Email'));

const requiredEmail = (t) => requiredString(t).email(t('Validations.Email'));

const requiredDate = (t) => date(t).required(t('Validations.Date'));

const mixed = () => yup.mixed();

const fileRequired = (t) => mixed().required(t('Validations.FileRequired'));

const fileRequiredPdf = (t) =>
  fileRequired(t).test('fileFormat', 'PDF only', (value) => {
    console.log(value);
    return value && ['application/pdf'].includes(value.type);
  });

const requiredCsosRegNum = (t) =>
  string()
    .matches('^[A-Z]{3}\\d{4}$', { message: t('Validations.RegNum') })
    .required(t('Validations.RegistrationNumber'));

const time = (t) =>
  string().matches('^\\d{1,2}:\\d{1,2}:\\d{1,2}$', {
    message: t('Validations.Time'),
  });

const requiredTime = (t) => time(t).required(t('Validations.Required'));

const requiredArrayOfNumbers = (t) => array().of(number(t)).required();

const passwordsDontMatch = (t) => (passwordFieldName) =>
  requiredString(t).oneOf(
    [yup.ref(passwordFieldName)],
    t('Validations.PasswordsDontMatch'),
  );

const uniqueMinMaxEmails =
  (t) =>
  ({ min, max }) =>
    requiredString(t).test('uniqueMinMaxEmails', '', function (emails = '') {
      const { path, createError } = this;

      const rawEmails = emailsStringToEmailArray(emails);

      const emailsSet = new Set(rawEmails);

      if (
        rawEmails
          .map((email_) => email(t).isValidSync(email_))
          .filter((booleanValue) => !booleanValue).length !== 0
      ) {
        return createError({
          path,
          message: t('Validations.EmailsContainNotEmail'),
        });
      }

      if (rawEmails.length !== emailsSet.size) {
        return createError({
          path,
          message: t('Validations.EmailsUnique'),
        });
      }

      if (rawEmails.length < min || rawEmails.length > max) {
        return createError({
          path,
          message: t('Validations.EmailsMinMax', { min, max }),
        });
      }

      return true;
    });

const gpsLatitude = (t) =>
  number(t)
    .min(-90, t('Validations.Latitude'))
    .max(90, t('Validations.Latitude'));
const gpsLongitude = (t) =>
  number(t)
    .min(-180, t('Validations.Longitude'))
    .max(180, t('Validations.Longitude'));
