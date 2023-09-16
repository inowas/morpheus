import React from 'react';

import Navbar from '../components/Navbar';
import {useLocation, useNavigate} from 'react-router-dom';

interface IProps {
  children: React.ReactNode;
}

const ApplicationContainer: React.FC<IProps> = ({children}) => {

  const {pathname} = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <header className="App-header">
        <Navbar location={pathname} navigateTo={navigate}/>
      </header>
      <main>
        <div className="wrapper">
          {children}
        </div>
      </main>
    </>
  );
};

export default ApplicationContainer;
