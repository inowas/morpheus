import React, {ReactNode} from 'react';
import {Container} from 'semantic-ui-react';
import Footer from '../components/Footer';
import NavBar from '../components/Navbar';
import {useNavigate} from 'react-router-dom';
import useNavbarItems from '../../application/useNavbarItems';
import { Header } from 'components';
import NavbarTop from '../components/NavbarTop';

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    width: '100%',
    height: '100%',
  },
  header: {
    width: '100%',
    position: 'fixed',
    top: '0',
    zIndex: 10,
    background: '#ffffff',
    boxShadow: '0 3px 2px 0 rgb(50 50 50 / 6%)'
  },
  footer: {
    marginTop: '20px',
    width: '100%',
    minHeight: '150px',
  },

};

interface IProps {
  children: ReactNode;
}

const ApplicationContainer = ({children}: IProps) => {
  const navigateTo = useNavigate();
  const {navbarItems} = useNavbarItems();
  

  return (
    <>
      <Header 
        // FIXME: 
        style={styles.header}
        // style={{
        //   width: '100%',
        //   position: 'fixed',
        //   top: '0',
        //   zIndex: 10,
        //   background: '#ffffff',
        //   boxShadow: '0 3px 2px 0 rgb(50 50 50 / 6%)'
        // }}
      >
        <NavbarTop/>
        <NavBar navbarItems={navbarItems} navigateTo={navigateTo}/>
      </Header>
      <Container style={styles.wrapper}>
        <Container style={styles.content}>
          {children}
        </Container>
      </Container>
      <Footer style={styles.footer} width={1280}/>
    </>
  );
};

export default ApplicationContainer;
