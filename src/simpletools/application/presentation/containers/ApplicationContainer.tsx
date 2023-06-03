import React, {ReactNode} from 'react';
import {Container} from 'semantic-ui-react';
import Footer from '../components/Footer';
import NavBar from '../components/Navbar';
import {useNavigate} from 'react-router-dom';
import useNavbarItems from '../../application/useNavbarItems';

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
  navbar: {
    margin: '0 auto',
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
      <Container style={styles.wrapper}>
        <NavBar navbarItems={navbarItems} navigateTo={navigateTo}/>
        <Container style={styles.content}>
          {children}
        </Container>
      </Container>
      <Footer style={styles.footer} width={1280}/>
    </>
  );
};

export default ApplicationContainer;
