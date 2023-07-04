import React, {SyntheticEvent} from 'react';
import {Dropdown, DropdownProps} from 'semantic-ui-react';
import './LanguageSelector.less';
import {ILanguage, ILanguageOption} from './types/languageSelector.type';
import {getFlagByLanguageCode} from './flags';

interface IProps {
  language: ILanguage['code'];
  languageList: ILanguage[];
  onChangeLanguage: (language: ILanguage['code']) => void;
}

const LanguageSelector = ({language, languageList, onChangeLanguage}: IProps) => {

  const handleChangeLanguage = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => onChangeLanguage(value as ILanguage['code']);

  const languageOptions: ILanguageOption[] = languageList.map((item) => ({
    key: item.code,
    value: item.code,
    text: (
      <span>
        <img
          src={getFlagByLanguageCode(item.code)}
          alt={item.label}
          className="languageFlag"
        />
        <span className="languageLabel">{item.label}</span>
      </span>
    ),
  }));

  return (
    <Dropdown
      className="languageSelector"
      selection={true}
      icon={false}
      value={language}
      options={languageOptions}
      onChange={handleChangeLanguage}
    />
  );
};

export default LanguageSelector;
