import {i18n} from 'i18next';
import {useTranslation as reactI18NextTranslation} from 'react-i18next';

interface IUseTranslation {
  translate: (key: string, options?: any) => string;
  i18n: i18n;
  language: 'de' | 'en';
}

const useTranslation = (namespace?: string): IUseTranslation => {
  const {t: translate, i18n: i18next} = reactI18NextTranslation(namespace);
  return {translate, i18n: i18next, language: i18next.language as 'de' | 'en'};
};

export default useTranslation;
export type {IUseTranslation};
