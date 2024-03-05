import {useTranslation} from 'common/hooks';
import {i18n as II18n} from 'i18next';

interface IUseTranslate {
    translate: (key: string) => string;
    i18n: II18n;
    language: string;
}

const useTranslate = (): IUseTranslate => {
  const {translate, i18n, language} = useTranslation();
  return {translate, i18n, language};
};

export default useTranslate;
export type {IUseTranslate};
