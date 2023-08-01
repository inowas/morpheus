import React, {ReactNode, useState} from 'react';

import Header from '../components/Header';
import {useNavbarItems} from '../../application';
import {ContentWrapper, Footer, Navbar} from 'components';
import {useNavigate} from '../../../common/hooks';

interface IProps {
  children: ReactNode;
}

type ILanguageCode = 'de-DE' | 'en-GB';

const ApplicationContainer = ({children}: IProps) => {
  const {navbarItems} = useNavbarItems();
  const [language, setLanguage] = useState<ILanguageCode>('de-DE');
  const navigateTo = useNavigate();

  return (
    <>
      <Header>
        <Navbar
          navbarItems={navbarItems}
          languageList={[
            {
              code: 'de-DE',
              label: 'Deutsch',
            },
            {
              code: 'en-GB',
              label: 'English',
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
