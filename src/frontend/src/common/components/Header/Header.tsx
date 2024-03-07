import {ContentWrapper, IPageWidth} from 'common/components';
import Navbar, {INavbarItem} from './Navbar';
import React, {RefObject, useEffect, useRef, useState} from 'react';

import {ILanguageList} from './Navbar/Navbar';
import styles from './Header.module.less';

type ILanguageCode = 'de-DE' | 'en-GB';

interface IProps {
  maxWidth?: IPageWidth;
  updateHeight?: (height: number) => void
  navbarItems: INavbarItem[];

  language?: ILanguageCode;
  languageList?: ILanguageList;
  onChangeLanguage?: (language: ILanguageCode) => void;
  navigateTo: (path: string) => void;
  pathname: string;
  showSidebarMenu?: boolean
  showSearchWrapper?: boolean;
  showCreateButton?: boolean;
}

const Header = ({
  maxWidth,
  updateHeight,
  navbarItems,
  language,
  languageList,
  onChangeLanguage,
  navigateTo,
  pathname,
  showSidebarMenu = false,
  showSearchWrapper = false,
  showCreateButton,
}: IProps) => {
  const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const [headerHeight, setHeaderHeight] = useState(ref.current?.clientHeight || 0);

  const updateHeaderHeight = () => {
    if (ref.current) {
      const height = ref.current.clientHeight;
      setHeaderHeight(height);
      if (updateHeight) {
        updateHeight(height); // Notify the parent about the updated height
      }
    }
  };

  // noinspection Eslint
  useEffect(() => {
    updateHeaderHeight(); // Set initial header height
    const handleResize = () => {
      updateHeaderHeight(); // Update header height when window resizes
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup the event listener
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header
      data-testid={'header'}
      className={`${showSidebarMenu ? styles.showSidebarMenu : ''}`}
      style={{
        paddingTop: headerHeight,
        zIndex: 110,
      }}
    >
      <div
        ref={ref}
        className={styles.headerInner}
      >
        <ContentWrapper
          minHeight={'auto'} maxWidth={maxWidth}
          showSidebarMenu={showSidebarMenu}
        >
          <Navbar
            navbarItems={navbarItems}
            languageList={languageList}
            language={language}
            onChangeLanguage={onChangeLanguage}
            navigateTo={navigateTo}
            pathname={pathname}
            showSearchWrapper={showSearchWrapper}
            showCreateButton={showCreateButton}
          />
        </ContentWrapper>
      </div>
    </header>
  );
};

export default Header;
