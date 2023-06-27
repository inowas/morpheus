import React, {useState} from 'react';
import {Dropdown, DropdownProps} from 'semantic-ui-react';
import './LanguageSelector.less';

const languages: Language[] = [
  {code: 'en', label: 'English', flag: 'https://tu-dresden.de/++theme++tud.theme.webcms2/img/flags/flag-en.svg'},
  {code: 'de', label: 'German', flag: 'https://tu-dresden.de/++theme++tud.theme.webcms2/img/flags/flag-de.svg'},
];

interface Language {
  code: string;
  label: string;
  flag: string;
}

type LanguageOption = {
  key: string;
  value: string;
  text: JSX.Element;
};

const LanguageSelector: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleChangeLanguage = (_: React.SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
    setSelectedLanguage(value as string);
    //FIXME Add logic to handle language change
  };

  const languageOptions: LanguageOption[] = languages.map((language) => ({
    key: language.code,
    value: language.code,
    text: (
      <span>
        <img
          src={language.flag} alt={language.label}
          className="languageFlag"
        />
        <span className="languageLabel">{language.label}</span>
      </span>
    ),
  }));

  return (
    <Dropdown
      className="languageSelector"
      selection={true}
      icon={false}
      value={selectedLanguage}
      options={languageOptions}
      onChange={handleChangeLanguage}
    />
  );
};

export default LanguageSelector;
