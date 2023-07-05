import React, {ReactNode, useState} from 'react';

import Header from '../components/Header';
import {useNavigate} from 'react-router-dom';
import {useNavbarItems} from '../../application';
import {ContentWrapper, Footer} from 'components';
import Navbar from '../../../../components/Navbar';


interface IProps {
  children: ReactNode;
}

type ILanguageCode = 'de-DE' | 'en-GB';

const ApplicationContainer = ({children}: IProps) => {
  const navigateTo = useNavigate();
  const {navbarItems} = useNavbarItems();
  const [language, setLanguage] = useState<ILanguageCode>('de-DE');

  return (
    <>
      <Header>
        <Navbar
          navbarItems={navbarItems}
          navigateTo={navigateTo}
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
        />
      </Header>
      <ContentWrapper minHeight={'100vh'}>
        {children}
      </ContentWrapper>
      <Footer/>
    </>
  );
};

export default ApplicationContainer;
