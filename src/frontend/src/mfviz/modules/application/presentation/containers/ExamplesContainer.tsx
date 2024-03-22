import {useLocation, useNavigate} from 'react-router-dom';

import ExamplesNavbar from '../components/ExamplesNavbar';
import React from 'react';

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
