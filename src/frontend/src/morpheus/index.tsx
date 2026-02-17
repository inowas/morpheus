import React, {Suspense} from 'react';
import * as Sentry from '@sentry/react';

import App from './App';
import {I18nextProvider} from 'react-i18next';
import {Provider} from 'react-redux';
import config from '../config';
import {createRoot} from 'react-dom/client';
import {getI18n} from './i18n';
import {store} from './store';
import AuthProvider from 'morpheus/authentication/presentation/containers/AuthProvider';

declare global {
  interface Window {
    Plotly?: IPlotly
  }
}

if (config.sentry.enabled && config.sentry.dsn) {
  Sentry.init({
    dsn: config.sentry.dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Suspense fallback={<div>Loading...</div>}>
    <I18nextProvider i18n={getI18n({ns: ['Modflow']})}>
      <AuthProvider>
        <Provider store={store}>
          <App/>
        </Provider>
      </AuthProvider>
    </I18nextProvider>
  </Suspense>,
);
