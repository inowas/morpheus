import React, {Suspense} from 'react';

import {AuthProvider} from 'react-oidc-context';
import App from './App';
import {I18nextProvider} from 'react-i18next';
import {Provider} from 'react-redux';
import config from '../config';
import {createRoot} from 'react-dom/client';
import {getI18n} from './i18n';
import {makeServer} from '../../mockServer';
import {store} from './store';

declare global {
  interface Window {
    Plotly?: IPlotly
  }
}

if (config.mockServerEnabled) {
  makeServer({environment: 'development'});
}

const oidcConfig = {
  authority: 'https://identity.inowas.com',
  client_id: 'inowas-dev',
  redirect_uri: 'http://localhost:4000',
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Suspense fallback={<div>Loading...</div>}>
    <I18nextProvider i18n={getI18n({ns: ['Modflow']})}>
      <AuthProvider {...oidcConfig}>
        <Provider store={store}>
          <App/>
        </Provider>
      </AuthProvider>
    </I18nextProvider>
  </Suspense>,
);
