import {DateTime} from 'luxon';

interface IUseDateTimeFormat {
  addDays: (dateString: string, days: number) => string;
  addWeeks: (dateString: string, weeks: number) => string;
  addMonths: (dateString: string, months: number) => string;
  addYears: (dateString: string, years: number) => string;
  getUnixTimestamp: (dateString: string) => number;
  formatDate: (dateString: string, formatString: string) => string;
  formatISO: (dateString: string) => string;
  formatISODate: (dateString: string) => string;
  formatISODateTime: (dateString: string) => string;
  isValid: (dateString: string) => boolean;
  parseUserInput: (isoDateString: string, formatString: string) => string;
}

const useDateTimeFormat = (timezone: string | undefined = 'UTC'): IUseDateTimeFormat => {

  // these formats will be saved in the user preferences
  const user_date_time_format = 'yyyy-MM-dd HH:mm:ss';
  const user_date_format = 'yyyy-MM-dd';


  const addDays = (dateString: string, days: number): string => {
    return DateTime.fromISO(dateString).setZone(timezone).plus({days}).toISO() as string;
  };

  const addWeeks = (dateString: string, weeks: number): string => {
    return DateTime.fromISO(dateString).setZone(timezone).plus({weeks}).toISO() as string;
  }

  const addMonths = (dateString: string, months: number): string => {
    return DateTime.fromISO(dateString).setZone(timezone).plus({months}).toISO() as string;
  }

  const addYears = (dateString: string, years: number): string => {
    return DateTime.fromISO(dateString).setZone(timezone).plus({years}).toISO() as string;
  }

  // returns the Unix timestamp of the given date string in milliseconds
  const getUnixTimestamp = (dateString: string): number => {
    return DateTime.fromISO(dateString).setZone(timezone).toMillis();
  };

  const formatDate = (isoDateString: string, formatString: string): string => {
    return DateTime.fromISO(isoDateString).setZone(timezone).toFormat(formatString);
  };

  const formatISO = (dateString: string): string => {
    return DateTime.fromISO(dateString).setZone(timezone).toISO() as string;
  };

  const formatISODate = (dateString: string): string => {
    return DateTime.fromISO(dateString).setZone(timezone).toFormat(user_date_format);
  };

  const formatISODateTime = (dateString: string): string => {
    return DateTime.fromISO(dateString).setZone(timezone).toFormat(user_date_time_format);
  };

  const isValid = (dateString: string): boolean => {
    return DateTime.fromISO(dateString).setZone(timezone).isValid;
  };

  // parse the user input to an ISO string
  // the format string is used to parse the input
  const parseUserInput = (dateString: string, formatString: string): string => {
    return DateTime.fromFormat(dateString, formatString, {zone: timezone}).toISO() as string;
  };

  return {
    addDays,
    addWeeks,
    addMonths,
    addYears,
    getUnixTimestamp,
    formatDate,
    formatISODate,
    formatISODateTime,
    formatISO,
    isValid,
    parseUserInput,
  };
};

export default useDateTimeFormat;
