import React, {ReactNode, RefObject, useRef} from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/Navbar';
import Header from '../components/Header';
import ContainerInowas from '../components/ContainerInowas';
import {useNavigate} from 'react-router-dom';
import useNavbarItems from '../../application/useNavbarItems';

interface IProps {
  children: ReactNode;
}

const ApplicationContainer = ({children}: IProps) => {
  const navigateTo = useNavigate();
  const {navbarItems} = useNavbarItems();
  const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  return (
    <>
      <Header>
        <NavBar
          navbarItems={navbarItems} navigateTo={navigateTo}
        />
      </Header>
      <ContainerInowas>
        {children}
      </ContainerInowas>
      <Footer/>
    </>
  );
};

export default ApplicationContainer;
