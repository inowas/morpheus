import {DateTime} from 'luxon';

interface IUseDateTimeFormat {
  addDays: (dateString: string, days: number) => string;
  getUnixTimestamp: (dateString: string) => number;
  format: (dateString: string, formatString: string) => string;
  formatISO: (dateString: string) => string;
  formatISODate: (dateString: string) => string;
  isValid: (dateString: string) => boolean;
  parseUserInput: (isoDateString: string, formatString: string) => string;
}

const useDateTimeFormat = (): IUseDateTimeFormat => {

  const defaultTimeZone = 'UTC';

  const addDays = (dateString: string, days: number): string => {
    return DateTime.fromISO(dateString).setZone(defaultTimeZone).plus({days}).toISO() as string;
  };

  // returns the Unix timestamp of the given date string in milliseconds
  const getUnixTimestamp = (dateString: string): number => {
    return DateTime.fromISO(dateString).setZone(defaultTimeZone).toMillis();
  };

  const format = (dateString: string, formatString: string): string => {
    return DateTime.fromISO(dateString).setZone(defaultTimeZone).toFormat(formatString);
  };

  const formatISO = (dateString: string): string => {
    return DateTime.fromISO(dateString).setZone(defaultTimeZone).toISO() as string;
  };

  const formatISODate = (dateString: string): string => {
    return DateTime.fromISO(dateString).setZone(defaultTimeZone).toFormat('yyyy-MM-dd');
  };

  const isValid = (dateString: string): boolean => {
    return DateTime.fromISO(dateString).setZone(defaultTimeZone).isValid;
  };

  const parseUserInput = (isoDateString: string, formatString: string): string => {
    return DateTime.fromFormat(isoDateString, formatString, {zone: defaultTimeZone}).toISO() as string;
  };

  return {
    addDays,
    getUnixTimestamp,
    format,
    formatISODate,
    formatISO,
    isValid,
    parseUserInput,
  };
};


export default useDateTimeFormat;
