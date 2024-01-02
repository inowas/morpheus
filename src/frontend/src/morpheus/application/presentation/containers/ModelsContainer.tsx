import React, {useEffect, useState} from 'react';
import {useIsEmbedded, useNavbarItems, useReleaseVersion, useTranslate} from '../../application';
import {Header, IPageWidth, ModelWrapper} from 'components';
import {useLocation, useNavigate, useSearchParams} from 'common/hooks';

type ILanguageCode = 'de-DE' | 'en-GB';

const ModelsContainer = () => {

  const {i18n, translate} = useTranslate();
  const {navbarItems} = useNavbarItems();
  const [language, setLanguage] = useState<ILanguageCode>(i18n.language as ILanguageCode);
  const navigateTo = useNavigate();
  const location = useLocation();
  const {release} = useReleaseVersion();
  const [searchParams] = useSearchParams();

  const {isEmbedded, setIsEmbedded} = useIsEmbedded();
  const showFooter = !isEmbedded;
  const showHeader = !isEmbedded;
  const pageSize: IPageWidth = 'auto';
  const [headerHeight, setHeaderHeight] = useState(0);
  const updateHeaderHeight = (height: number) => {
    setHeaderHeight(height);
  };

  if ('true' === searchParams.get('embedded') && !isEmbedded) {
    setIsEmbedded(true);
  }

  if ('false' === searchParams.get('embedded') && isEmbedded) {
    setIsEmbedded(false);
  }


  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const languageList: { code: ILanguageCode; label: string }[] = [
    {
      code: 'en-GB',
      label: 'English',
    },
  ];

  return (
    <>
      {showHeader &&
        <Header
          maxWidth={pageSize}
          updateHeight={updateHeaderHeight}
          navbarItems={navbarItems}
          languageList={languageList}
          language={language}
          onChangeLanguage={setLanguage}
          navigateTo={navigateTo}
          pathname={location.pathname}
          showSearchWrapper={true}
          showCreateButton={true}
          showModelSidebar={true}
        />}
      <ModelWrapper
        headerHeight={headerHeight}
        showModelSidebar={true}
      />


      {/*{showFooter ? <Footer release={release} maxWidth={pageSize}/> :*/}
      {/*  <span*/}
      {/*    style={{*/}
      {/*      margin: '0 auto',*/}
      {/*      textAlign: 'center',*/}
      {/*      fontSize: '0.8rem',*/}
      {/*    }}*/}
      {/*  >Release: {release}</span>*/}
      {/*}*/}
    </>
  );
};

export default ModelsContainer;
