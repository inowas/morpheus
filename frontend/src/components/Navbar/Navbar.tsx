import React from 'react';
import {INavbarItem} from './types/navbar.type';
import styles from './Navbar.module.less';
import NavTop from './NavTop/NavTop';
import NavBottom from './NavBottom/NavBottom';

type ILanguageCode = 'de-DE' | 'en-GB';
type ILanguageList = Array<{
  code: ILanguageCode;
  label: string;
}>;

interface IProps {
  navbarItems: INavbarItem[];
  language: ILanguageCode;
  languageList: ILanguageList;
  onChangeLanguage: (language: ILanguageCode) => void;
  navigateTo: (path: string) => void;
}

const Navbar = ({navbarItems, language, languageList, onChangeLanguage, navigateTo}: IProps) => {

  return (
    <>
      <div className={styles.wrapper}>
        <NavTop
          language={language}
          languageList={languageList}
          onChangeLanguage={onChangeLanguage}
          navigateTo={navigateTo}
        />
      </div>
      <NavBottom navbarItems={navbarItems}/>
    </>
  );
};

export default Navbar;
