export interface ILanguage {
  code: 'de' | 'en';
  label: string;
}

export type ILanguageOption = {
  key: string;
  value: string;
  text: JSX.Element;
};
