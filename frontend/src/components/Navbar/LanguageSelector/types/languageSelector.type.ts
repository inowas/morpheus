export interface ILanguage {
  code: ILanguageCode;
  label: string;
}

type ILanguageCode = 'de-DE' | 'en-GB';

export type ILanguageOption = {
  key: string;
  value: string;
  text: JSX.Element;
};
