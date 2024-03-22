import {Footer, Header, IPageWidth} from 'common/components';
import React, {ReactNode, useEffect, useState} from 'react';
import {useNavbarItems, useTranslate} from '../../application';
import {useLocation, useNavigate, useReleaseVersion} from 'common/hooks';
import {ContentContainer} from '../components';

interface IProps {
  children: ReactNode;
  disableFooter?: boolean;
}

type ILanguageCode = 'de-DE' | 'en-GB';

const ApplicationContainer = ({children, disableFooter = false}: IProps) => {

  const {i18n} = useTranslate();

  const {navbarItems, showSearchBar, showButton} = useNavbarItems();
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
        navigateTo={navigateTo}
        language={language}
        languageList={languageList}
        onChangeLanguage={setLanguage}
      />
      <ContentContainer>
        {children}
      </ContentContainer>

      {!disableFooter && <Footer release={release} maxWidth={pageSize}/>}
    </>
  );
};

export default ApplicationContainer;
