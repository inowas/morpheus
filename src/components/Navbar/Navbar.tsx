import React from 'react';
import {INavbarItem} from './types/navbar.type';
import styles from './Navbar.module.less';
import NavTop from './NavTop/NavTop';
import NavBottom from './NavBottom/NavBottom';

type ILanguageCode = 'de-DE' | 'en-GB';

interface IProps {
  navbarItems: INavbarItem[];
  navigateTo: (path: string) => void;
  language: ILanguageCode;
  languageList: {
    code: ILanguageCode;
    label: string;
  }[]
  onChangeLanguage: (language: ILanguageCode) => void;
}

const Navbar = ({navbarItems, navigateTo, language, languageList, onChangeLanguage}: IProps) => {

  return (
    <>
      <div className={styles.wrapper}>
        <NavTop
          language={language}
          languageList={languageList}
          onChangeLanguage={onChangeLanguage}
        />
      </div>
      <div className={styles.wrapperNavigation}>
        <NavBottom navbarItems={navbarItems} navigateTo={navigateTo}/>
      </div>
    </>
  );
};

export default Navbar;
