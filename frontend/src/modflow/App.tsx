import React, {useState} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';

import '../../styleguide/semantic.less';
import './App.less';
import Example_1 from './modules/application/presentation/containers/Example_1';
import Example_2 from './modules/application/presentation/containers/Example_2';
import Example_3 from './modules/application/presentation/containers/Example_3';
import Example_4 from './modules/application/presentation/containers/Example_4';
import ApplicationContainer from './modules/application/presentation/containers/ApplicationContainer';

const App = () => {

  const [showSection, setShowSection] = useState<string>('example_1');

  return (
    <ApplicationContainer
      showSection={showSection}
      onShowSectionChange={(section) => setShowSection(section)}
    >
      {'example_1' === showSection && <Example_1/>}
      {'example_2' === showSection && <Example_2/>}
      {'example_3' === showSection && <Example_3/>}
      {'example_4' === showSection && <Example_4/>}

    </ApplicationContainer>
  );
};

export default App;
