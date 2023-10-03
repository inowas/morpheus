<<<<<<<< HEAD:src/frontend/src/morpheus/T08/application/useTranslate.ts
import {useTranslation, IUseTranslation} from 'common/hooks';
========
import {useTranslation} from 'morpheus/common/hooks';
import {i18n as II18n} from 'i18next';
>>>>>>>> origin/main:src/frontend/src/morpheus/T02/application/useTranslate.ts

interface IUseTranslate {
  translate: (key: string) => string;
  i18n: IUseTranslation['i18n'];
  language: string;
}

const useTranslate = (): IUseTranslate => {
  const {translate, i18n, language} = useTranslation();
  return {translate, i18n, language};
};

export default useTranslate;
export type {IUseTranslate};
