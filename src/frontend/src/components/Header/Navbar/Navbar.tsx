import React from 'react';
import {INavbarItem} from './types/navbar.type';
import NavTop from './NavTop/NavTop';
import NavBottom from './NavBottom/NavBottom';
import styles from './Navbar.module.less';

type ILanguageCode = 'de-DE' | 'en-GB';
export type ILanguageList = Array<{
  code: ILanguageCode;
  label: string;
}>;

interface IProps {
  navbarItems: INavbarItem[];
  language?: ILanguageCode;
  languageList?: ILanguageList;
  onChangeLanguage?: (language: ILanguageCode) => void;
  navigateTo: (path: string) => void;
  pathname: string;
  showSearchWrapper?: boolean;
  showCreateButton?: boolean;
  showModelSidebar?: boolean;
}

const Navbar = ({
  navbarItems,
  language,
  languageList,
  onChangeLanguage,
  navigateTo,
  pathname,
  showSearchWrapper = false,
  showCreateButton = false,
  showModelSidebar = false,
}: IProps) => {

  return (
    <div
      data-testid={'test-navbar'}
      style={{position: 'relative'}}
      className={`${showModelSidebar ? styles.withSidebar : ''}`}
    >
      <NavTop
        language={language}
        languageList={languageList}
        onChangeLanguage={onChangeLanguage}
        navigateTo={navigateTo}
      />
      <NavBottom
        navbarItems={navbarItems}
        pathname={pathname}
        navigateTo={navigateTo}
        showSearchWrapper={showSearchWrapper}
        showCreateButton={showCreateButton}
      />
    </div>
  );
};

export default Navbar;
