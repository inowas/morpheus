import {ContentWrapper, Footer, Header, IPageWidth} from 'common/components';
import React, {ReactNode, useEffect, useState} from 'react';
import {useNavbarItems, useTranslate} from '../../application';
import {useLocation, useNavigate, useReleaseVersion} from 'common/hooks';

interface IProps {
  children: ReactNode;
}

type ILanguageCode = 'de-DE' | 'en-GB';

const ApplicationContainer = ({children}: IProps) => {

  const {i18n} = useTranslate();
  const {navbarItems} = useNavbarItems();
  const [language, setLanguage] = useState<ILanguageCode>(i18n.language as ILanguageCode);
  const navigateTo = useNavigate();
  const location = useLocation();
  const {release} = useReleaseVersion();

  const pageSize: IPageWidth = 'auto';
  const languageList: { code: ILanguageCode; label: string }[] = [{code: 'en-GB', label: 'English'}];

  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <>
      <Header
        maxWidth={pageSize}
        navbarItems={navbarItems}
        languageList={languageList}
        language={language}
        onChangeLanguage={setLanguage}
        navigateTo={navigateTo}
        pathname={location.pathname}
        showSearchWrapper={true}
      />

      <ContentWrapper minHeight={'auto'} maxWidth={pageSize}>
        {children}
      </ContentWrapper>

      <Footer release={release} maxWidth={pageSize}/>
    </>
  );
};

export default ApplicationContainer;
