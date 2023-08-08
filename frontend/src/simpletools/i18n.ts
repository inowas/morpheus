import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';

interface IConfig {
  ns: string[],
}

const getI18n = (config: IConfig) => {
  const {ns} = config;
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      debug: true,
      ns: ns,
      fallbackLng: 'en',
    });
  return i18n;
};

export {
  getI18n,
};
