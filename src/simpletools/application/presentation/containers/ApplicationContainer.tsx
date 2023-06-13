import React, {ReactNode, RefObject, useEffect, useRef, useState} from 'react';
import {Container} from 'semantic-ui-react';
import Footer from '../components/Footer';
import NavBar from '../components/Navbar';
// import {Header} from 'components';
import Header from '../components/Header';
import {useNavigate} from 'react-router-dom';
import useNavbarItems from '../../application/useNavbarItems';

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

      <Header>
        <NavBar
          navbarItems={navbarItems} navigateTo={navigateTo}
        />
      </Header>
      {/*<Header*/}
      {/*  style={{*/}
      {/*    width: '100%',*/}
      {/*    position: 'fixed',*/}
      {/*    top: '0',*/}
      {/*    zIndex: 10,*/}
      {/*    background: '#ffffff',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <div*/}
      {/*    ref={ref}*/}
      {/*    style={{*/}
      {/*      height: '100%',*/}
      {/*      position: 'absolute',*/}
      {/*      top: 0,*/}
      {/*      left: 0,*/}
      {/*    }}*/}
      {/*  ></div>*/}
      {/*  <NavBar*/}
      {/*    navbarItems={navbarItems} navigateTo={navigateTo}*/}
      {/*  />*/}
      {/*</Header>*/}

      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '40px 0',
          paddingTop: headerHeight + 'px',
          minHeight: '100vh',
        }}
      >
        {children}
      </Container>

      <Footer
        style={{
          marginTop: '20px',
          width: '100%',
          minHeight: '150px',
        }}
        width={1280}
      />
    </>
  );
};

export default ApplicationContainer;
