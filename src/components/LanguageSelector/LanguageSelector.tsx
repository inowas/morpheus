import React, {useState} from 'react';
import {Dropdown, DropdownProps} from 'semantic-ui-react';
import './LanguageSelector.less';
import {ILanguage, ILanguageOption} from './types/languageSelector.type';

interface IProps {
  languages: ILanguage[]
}

const LanguageSelector = ({languages}: IProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleChangeLanguage = (_: React.SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
    setSelectedLanguage(value as string);
    //FIXME Add logic to handle language change
  };

  const getFlagUrl = ((code: string) => {
    switch (code) {
    case 'en':
      return require('./assets/flag-en.svg');
    case 'de':
      return require('./assets/flag-de.svg');
    default:
      return '';
    }
  });

  const languageOptions: ILanguageOption[] = languages.map((language) => ({
    key: language.code,
    value: language.code,
    text: (
      <span>
        <img
          src={getFlagUrl(language.code)} alt={language.label}
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
