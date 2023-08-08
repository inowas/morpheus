import React, {ReactNode, useState} from 'react';
import {ContentWrapper} from 'components';
import {Footer, Header, Navbar} from '../components/';
import {useNavbarItems} from '../../application';
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
