import React, {ReactNode, useEffect, useState} from 'react';
import {useIsEmbedded, useNavbarItems, useReleaseVersion, useTranslate} from '../../application';
import {ContentWrapper} from 'components';
import {Footer, Header, Navbar} from '../../../../components';
import {useLocation, useNavigate, useSearchParams} from 'common/hooks';

interface IProps {
  children: ReactNode;
}


type ILanguageCode = 'de-DE' | 'en-GB';

const ApplicationContainer = ({children}: IProps) => {

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

  return (
    <>
      {showHeader &&
        <Header>
          <Navbar
            navbarItems={navbarItems}
            languageList={[
              {
                code: 'en-GB',
                label: translate('english'),
              },
            ]}
            language={language}
            onChangeLanguage={setLanguage}
            navigateTo={navigateTo}
            pathname={location.pathname}
          />
        </Header>
      }
      <ContentWrapper minHeight={'auto'}>
        {children}
      </ContentWrapper>
      {showFooter ? <Footer release={release}/> :
        <span
          style={{
            margin: '0 auto',
            textAlign: 'center',
            fontSize: '0.8rem',
          }}
        >Release: {release}</span>
      }
    </>
  );
};

export default ApplicationContainer;
