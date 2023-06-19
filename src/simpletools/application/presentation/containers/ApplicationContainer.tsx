import React, {ReactNode} from 'react';

import Header from '../components/Header';
import {useNavigate} from 'react-router-dom';
import {useNavbarItems} from '../../application';
import {ContentWrapper, Footer, Navbar} from 'components';

interface IProps {
  children: ReactNode;
}

const ApplicationContainer = ({children}: IProps) => {
  const navigateTo = useNavigate();
  const {navbarItems} = useNavbarItems();

  return (
    <>
      <Header>
        <Navbar navbarItems={navbarItems} navigateTo={navigateTo}/>
      </Header>
      <ContentWrapper minHeight={'100vh'}>
        {children}
      </ContentWrapper>
      <Footer/>
    </>
  );
};

export default ApplicationContainer;
