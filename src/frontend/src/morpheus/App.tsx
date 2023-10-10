import '../../styleguide/semantic.less';
import './App.less';
import {AuthProvider} from 'oidc-react';

import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import Routes from './routes';

const oidcConfig = {
  onSignIn: (response: any) => {
    alert('The user has signed in');
    console.log({response});
  },
  authority: 'https://identity.inowas.localhost/realms/inowas/',
  clientId: 'morpheus-frontend',
  responseType: 'code',
  redirectUri: 'http://localhost:4000',
  scope: 'openid profile email',
};

const App = () => (
  <AuthProvider {...oidcConfig}>
    <BrowserRouter basename="/">
      <Routes/>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
