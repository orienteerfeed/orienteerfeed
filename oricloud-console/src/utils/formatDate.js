import { format, parseISO, subHours } from 'date-fns';
import formatDuration from 'date-fns/formatDuration';
import addSeconds from 'date-fns/addSeconds';
import { enGB, cs } from 'date-fns/locale';

const DATE_FORMAT = 'd. M. yyyy';
const DATETIME_FORMAT = 'dd. MM. yyyy HH:mm';
const DATE_FORMAT_DAY = 'ccc, dd. MM. yyyy';
const TIME_FORMAT = 'HH:mm:ss';
const HHMM_FORMAT = 'HH:mm';

const SECONDS_PER_DAY = 86400;
const HOURS_PER_DAY = 24;

const locales = { enGB, cs };

export const formatDate = (dateOrStringDate) => {
  let parsedDate = dateOrStringDate;

  if (typeof dateOrStringDate === 'string') {
    parsedDate = parseISO(dateOrStringDate);
  }
  return format(parsedDate, DATE_FORMAT);
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (dateOrStringDate) => {
  let parsedDate = dateOrStringDate;
  if (
    typeof dateOrStringDate === 'string' &&
    dateOrStringDate !== 'undefined'
  ) {
    parsedDate = parseISO(dateOrStringDate);
    return format(parsedDate, DATETIME_FORMAT);
  } else {
    return 'undefined';
  }
};

export const formatDateWithDay = (dateOrStringDate) => {
  let parsedDate = dateOrStringDate;
  const locale = locales[window.__localeId__];

  if (
    typeof dateOrStringDate === 'string' &&
    dateOrStringDate !== 'undefined'
  ) {
    parsedDate = parseISO(dateOrStringDate);
    return format(parsedDate, DATE_FORMAT_DAY, { locale: locale });
  } else {
    return 'undefined';
  }
};

export const formatDurationTime = (duration) => {
  let parsedTime = duration;
  if (
    (typeof duration === 'number' || typeof duration === 'string') &&
    duration !== 'undefined'
  ) {
    return formatDuration(
      { seconds: parsedTime },
      { format: ['hours', 'weekminutes', 'seconds'] },
    );
  } else {
    return 'undefined';
  }
};

export const formatSecondsToTime = (seconds) => {
  if (typeof seconds === 'number' && seconds !== 'undefined') {
    return format(subHours(addSeconds(new Date(0), seconds), 1), TIME_FORMAT);
  } else {
    return '';
  }
};

export const formatSecondsToHhMm = (seconds) => {
  if (typeof seconds === 'number' && seconds !== 'undefined') {
    return format(subHours(addSeconds(new Date(0), seconds), 1), HHMM_FORMAT);
  } else {
    return '';
  }
};

export const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

export const secondsToHms = (seconds, format) => {
  const days = Math.floor(seconds / SECONDS_PER_DAY);
  const remainderSeconds = seconds % SECONDS_PER_DAY;
  let hms;
  if (typeof format === 'undefined' || !format || format === 'hms') {
    hms = new Date(remainderSeconds * 1000).toISOString().substring(11, 19);
  } else if (format === 'hm') {
    hms = new Date(remainderSeconds * 1000).toISOString().substring(11, 16);
  }
  return hms.replace(/^(\d+)/, (h) =>
    `${Number(h) + days * HOURS_PER_DAY}`.padStart(2, '0'),
  );
};

// Function to format Date object to YYYY-MM-DD string
export const formatDateForInput = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based, so we add 1
  const day = dateObj.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Function to format Date object to YYYY-MM-DDTHH:MM string
export const formatDateTimeForInput = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
  const day = dateObj.getDate().toString().padStart(2, '0');
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
