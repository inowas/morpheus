import {DateTime} from 'luxon';

interface IUseDateTimeFormat {
  addDays: (dateString: string, days: number) => string;
  getUnixTimestamp: (dateString: string) => number;
  format: (dateString: string, formatString: string) => string;
  formatISO: (dateString: string) => string;
  formatISODate: (dateString: string) => string;
  formatISODateTime: (dateString: string) => string;
  isValid: (dateString: string) => boolean;
  parseUserInput: (isoDateString: string, formatString: string) => string;
}

const useDateTimeFormat = (timezone: string | undefined = 'UTC'): IUseDateTimeFormat => {

  const addDays = (dateString: string, days: number): string => {
    return DateTime.fromISO(dateString).setZone(timezone).plus({days}).toISO() as string;
  };

  // returns the Unix timestamp of the given date string in milliseconds
  const getUnixTimestamp = (dateString: string): number => {
    return DateTime.fromISO(dateString).setZone(timezone).toMillis();
  };

  const format = (dateString: string, formatString: string): string => {
    return DateTime.fromISO(dateString).setZone(timezone).toFormat(formatString);
  };

  const formatISO = (dateString: string): string => {
    return DateTime.fromISO(dateString).setZone(timezone).toISO() as string;
  };

  const formatISODate = (dateString: string): string => {
    return DateTime.fromISO(dateString).setZone(timezone).toFormat('yyyy-MM-dd');
  };

  const formatISODateTime = (dateString: string): string => {
    return DateTime.fromISO(dateString).setZone(timezone).toFormat('yyyy-MM-dd HH:mm:ss');
  };

  const isValid = (dateString: string): boolean => {
    return DateTime.fromISO(dateString).setZone(timezone).isValid;
  };

  const parseUserInput = (isoDateString: string, formatString: string): string => {
    return DateTime.fromFormat(isoDateString, formatString, {zone: timezone}).toISO() as string;
  };

  return {
    addDays,
    getUnixTimestamp,
    format,
    formatISODate,
    formatISODateTime,
    formatISO,
    isValid,
    parseUserInput,
  };
};


export default useDateTimeFormat;
