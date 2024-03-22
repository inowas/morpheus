import '../../styleguide/semantic.less';
import './morpheus.less';

import {BrowserRouter} from 'react-router-dom';
import React from 'react';
import Routes from './routes';

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes/>
    </BrowserRouter>
  );
};

export default App;
