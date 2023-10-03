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
      lng: 'en-GB',
      supportedLngs: ['en-GB', 'de-DE'],
      ns: ns,
      fallbackLng: 'en-GB',
      load: 'currentOnly',
    });
  return i18n;
};

export {
  getI18n,
};
