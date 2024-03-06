import '../../styleguide/semantic.less';
import './App.less';

import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';

import CalculationResultsContainer from './modules/calculation/presentation/containers/CalculationResultsContainer';
import Example_1 from './modules/application/presentation/containers/Example_1';
import Example_2 from './modules/application/presentation/containers/Example_2';
import Example_3 from './modules/application/presentation/containers/Example_3';
import Example_4 from './modules/application/presentation/containers/Example_4';
import Example_5 from './modules/application/presentation/containers/Example_5';
import ExamplesContainer from './modules/application/presentation/containers/ExamplesContainer';
import React from 'react';
import SubmitCalculationIdContainer from './modules/calculation/presentation/containers/SubmitCalculationIdContainer';

const App = () => {

  const renderRouteToExamples = (component: React.ReactNode) => {
    return (
      <ExamplesContainer>
        {component}
      </ExamplesContainer>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<SubmitCalculationIdContainer/>}/>
        <Route path={'/:calculationId'} element={<CalculationResultsContainer/>}/>
        <Route path={'*'} element={<Navigate to={'/'}/>}/>
        <Route path={'/examples/example_1'} element={renderRouteToExamples(<Example_1/>)}/>
        <Route path={'/examples/example_2'} element={renderRouteToExamples(<Example_2/>)}/>
        <Route path={'/examples/example_3'} element={renderRouteToExamples(<Example_3/>)}/>
        <Route path={'/examples/example_4'} element={renderRouteToExamples(<Example_4/>)}/>
        <Route path={'/examples/example_5'} element={renderRouteToExamples(<Example_5/>)}/>
        <Route path={'/examples/*'} element={<Navigate to={'/examples/example_1'}/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
