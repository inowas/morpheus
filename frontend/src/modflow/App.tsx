import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';

import '../../styleguide/semantic.less';
import './App.less';
import Example_1 from './modules/application/presentation/containers/Example_1';
import Example_2 from './modules/application/presentation/containers/Example_2';
import Example_3 from './modules/application/presentation/containers/Example_3';
import Example_4 from './modules/application/presentation/containers/Example_4';
import ApplicationContainer from './modules/application/presentation/containers/ApplicationContainer';

const App = () => (
  <BrowserRouter basename="/modflow">
    <Routes>
      <Route path="/" element={<Navigate to={'example_4'}/> }/>
      <Route
        path="/example_1" element={
          <ApplicationContainer>
            <Example_1/>
          </ApplicationContainer>
        }
      />
      <Route
        path="/example_2" element={
          <ApplicationContainer>
            <Example_2/>
          </ApplicationContainer>
        }
      />
      <Route
        path="/example_3" element={
          <ApplicationContainer>
            <Example_3/>
          </ApplicationContainer>
        }
      />
      <Route
        path="/example_4" element={
          <ApplicationContainer>
            <Example_4/>
          </ApplicationContainer>
        }
      />
      <Route path="*" element={<Navigate to={'example_4'}/> }/>
    </Routes>
  </BrowserRouter>
);

export default App;
