import React from 'react';
import {INavbarItem} from './types/navbar.type';
import NavTop from './NavTop/NavTop';
import NavBottom from './NavBottom/NavBottom';

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
  showSidebarMenu?: boolean;
  showSearchWrapper?: boolean;
  hendlerTogglePopup?: () => void;
}

const Navbar = ({
  navbarItems,
  language,
  languageList,
  onChangeLanguage,
  navigateTo,
  pathname,
  showSearchWrapper = false,
  hendlerTogglePopup,
}: IProps) => {

  return (
    <div
      data-testid={'test-navbar'}
      style={{position: 'relative'}}
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
        showCreateButton={hendlerTogglePopup ? true : false}
        hendlerTogglePopup={hendlerTogglePopup}
      />
    </div>
  );
};

export default Navbar;
