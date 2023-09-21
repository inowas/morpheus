import React from 'react';

import ExamplesNavbar from '../components/ExamplesNavbar';
import {useLocation, useNavigate} from 'react-router-dom';

interface IProps {
  children: React.ReactNode;
}

const ExamplesContainer: React.FC<IProps> = ({children}) => {
  const {pathname} = useLocation();
  const navigateTo = useNavigate();

  return (
    <>
      <header className="App-header">
        <ExamplesNavbar location={pathname} navigateTo={navigateTo}/>
      </header>
      <main>
        <div className="wrapper">
          {children}
        </div>
      </main>
    </>
  );
};

export default ExamplesContainer;
