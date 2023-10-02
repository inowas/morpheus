import React, {Suspense} from 'react';
import {createRoot} from 'react-dom/client';

import App from './App';
import {I18nextProvider} from 'react-i18next';
import {getI18n} from './i18n';
import {Provider} from 'react-redux';
import {store} from './store';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Suspense fallback={<div>Loading...</div>}>
    <I18nextProvider i18n={getI18n({ns: ['Modflow']})}>
      <Provider store={store}>
        <App/>
      </Provider>
    </I18nextProvider>
  </Suspense>,
);
