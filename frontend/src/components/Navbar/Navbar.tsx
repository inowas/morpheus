import React from 'react';
import {INavbarItem} from './types/navbar.type';
import styles from './Navbar.module.less';
import NavTop from './NavTop/NavTop';
import {NavBottom} from './NavBottom/NavBottom';

type ILanguageCode = 'de-DE' | 'en-GB';

interface IProps {
  navbarItems: INavbarItem[];
  language: ILanguageCode;
  languageList: {
    code: ILanguageCode;
    label: string;
  }[]
  onChangeLanguage: (language: ILanguageCode) => void;
}

const Navbar = ({navbarItems, language, languageList, onChangeLanguage}: IProps) => {

  return (
    <>
      <div className={styles.wrapper}>
        <NavTop
          language={language}
          languageList={languageList}
          onChangeLanguage={onChangeLanguage}
        />
      </div>
      <NavBottom navbarItems={navbarItems}/>
    </>
  );
};

export default Navbar;
