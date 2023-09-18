import React from 'react';

import Navbar from '../components/Navbar';

interface IProps {
  children: React.ReactNode;
  showSection: string;
  onShowSectionChange: (section: string) => void;
}

const ApplicationContainer: React.FC<IProps> = ({children, showSection, onShowSectionChange}) => {

  return (
    <>
      <header className="App-header">
        <Navbar location={showSection} navigateTo={onShowSectionChange}/>
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
