import {format, parseISO, parse} from 'date-fns';

interface IUseFormatDateTime {
  formatDate: (isoDateString: string) => string;
  formatDateTime: (isoDateTimeString: string) => string;
  fromUserDateFormat: (dateString: string) => string;
  fromUserDateTimeFormat: (dateString: string) => string;
}

const useFormatDateTime = (): IUseFormatDateTime => {

  const userDateFormat = 'yyyy-MM-dd';
  const userDateTimeFormat = 'yyyy-MM-dd HH:mm';

  const formatDate = (isoDateString: string): string => format(parseISO(isoDateString), userDateFormat);
  const formatDateTime = (isoDateTimeString: string): string => format(parseISO(isoDateTimeString), userDateTimeFormat);

  const fromUserDateFormat = (dateString: string): string => parse(dateString, userDateFormat, new Date()).toISOString();
  const fromUserDateTimeFormat = (dateString: string): string => parse(dateString, userDateTimeFormat, new Date()).toISOString();

  return {
    formatDate,
    formatDateTime,
    fromUserDateFormat,
    fromUserDateTimeFormat,
  };
};


export default useFormatDateTime;
