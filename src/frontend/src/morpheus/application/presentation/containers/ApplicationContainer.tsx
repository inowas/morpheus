import React, {ReactNode, useEffect, useState} from 'react';

import {useNavbarItems, useTranslate} from '../../application';
import {ContentWrapper} from 'components';
import {Navbar} from '../components';
import {Footer, Header} from '../../../../components';
import {useNavigate} from 'common/hooks';
import useReleaseVersion from '../../application/useReleaseVersion';

interface IProps {
  children: ReactNode;
}

type ILanguageCode = 'de-DE' | 'en-GB';

const ApplicationContainer = ({children}: IProps) => {

  const {i18n, translate} = useTranslate();
  const {navbarItems} = useNavbarItems();
  const [language, setLanguage] = useState<ILanguageCode>(i18n.language as ILanguageCode);
  const navigateTo = useNavigate();
  const {release} = useReleaseVersion();

  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <>
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
        />
      </Header>
      <ContentWrapper minHeight={'auto'}>
        {children}
      </ContentWrapper>
      <Footer release={release}/>
    </>
  );
};

export default ApplicationContainer;
