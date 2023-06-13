import React, {ReactNode, RefObject, useEffect, useRef, useState} from 'react';
import {Container} from 'semantic-ui-react';
import NavBar from '../components/Navbar';
import {Header} from 'components';
import {useNavigate} from 'react-router-dom';
import useNavbarItems from '../../application/useNavbarItems';
import Footer from '../components/Footer';

interface IProps {
  children: ReactNode;
}

const ApplicationContainer = ({children}: IProps) => {
  const navigateTo = useNavigate();
  const [headerHeight, setHeaderHeight] = useState(0);
  const {navbarItems} = useNavbarItems();
  const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  useEffect(() => {
    setHeaderHeight(ref.current?.clientHeight || 0);
  }, []);


  return (
    <>
      <Header
        style={{
          width: '100%',
          position: 'fixed',
          top: '0',
          zIndex: 10,
          background: '#ffffff',
        }}
      >
        <div
          ref={ref}
          style={{
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        ></div>
        <NavBar
          navbarItems={navbarItems} headerHeight={headerHeight}
          navigateTo={navigateTo}
        />
      </Header>
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '40px 0',
          paddingTop: headerHeight,
          minHeight: '100vh',
        }}
      >
        {children}
      </Container>
      <Footer/>
    </>
  );
};

export default ApplicationContainer;
