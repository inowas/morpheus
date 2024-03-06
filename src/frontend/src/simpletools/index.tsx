import React, {Suspense} from 'react';

import App from './App';
import {I18nextProvider} from 'react-i18next';
import {createRoot} from 'react-dom/client';
import {getI18n} from './i18n';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Suspense fallback={<div>Loading...</div>}>
    <I18nextProvider i18n={getI18n({ns: ['SimpleTools']})}>
      <App/>
    </I18nextProvider>
  </Suspense>,
);
