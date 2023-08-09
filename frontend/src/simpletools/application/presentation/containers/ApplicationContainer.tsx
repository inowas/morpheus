import React, {ReactNode, useEffect, useState} from 'react';

import {useNavbarItems, useTranslate} from '../../application';
import {ContentWrapper} from 'components';
import {Footer, Header, Navbar} from '../components/';
import {useNavigate} from '../../../common/hooks';

interface IProps {
    children: ReactNode;
}

type ILanguageCode = 'de-DE' | 'en-GB';

const ApplicationContainer = ({children}: IProps) => {

  const {i18n, translate} = useTranslate();
  const {navbarItems} = useNavbarItems();
  const [language, setLanguage] = useState<ILanguageCode>(i18n.language as ILanguageCode);
  const navigateTo = useNavigate();


  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <>
      <Header>
        <Navbar
          navbarItems={navbarItems}
          languageList={[
            {
              code: 'de-DE',
              label: translate('german'),
            },
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
      <Footer/>
    </>
  );
};

export default ApplicationContainer;
