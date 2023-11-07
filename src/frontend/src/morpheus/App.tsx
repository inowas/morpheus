import '../../styleguide/semantic.less';
import './morpheus.less';

import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import Routes from './routes';

const App = () => (
  <BrowserRouter basename="/">
    <Routes/>
  </BrowserRouter>
);

export default App;
