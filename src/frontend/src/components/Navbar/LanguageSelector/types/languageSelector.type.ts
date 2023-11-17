type ILanguageCode = 'de-DE' | 'en-GB';

export interface ILanguage {
  code: ILanguageCode;
  label: string;
}

export type ILanguageOption = {
  key: string;
  value: string;
  text: JSX.Element;
};
