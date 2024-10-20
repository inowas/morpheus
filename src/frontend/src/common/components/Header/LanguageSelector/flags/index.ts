import {ILanguage} from '../types/languageSelector.type';
import de from './de.svg';
import gb from './gb.svg';

interface IFlags {
  [key: string]: string;
}

const flags: IFlags = {
  de,
  gb,
};

const getFlagByLanguageCode = (code: ILanguage['code']): string => {
  const countryCode = code.split('-')[1].toLowerCase();
  if (flags[countryCode]) {
    return flags[countryCode];
  }

  return '';
};

export {getFlagByLanguageCode};
