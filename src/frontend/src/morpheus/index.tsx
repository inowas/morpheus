import React, {Suspense} from 'react';
import {createRoot} from 'react-dom/client';

import App from './App';
import {I18nextProvider} from 'react-i18next';
import {Provider} from 'react-redux';

import {makeServer} from '../../mockServer';
import config from '../config';
import {getI18n} from './i18n';
import {store} from './store';

interface IPlotly {
  newPlot: (
    containerId: HTMLElement | string,
    plotData: any[],
    layout: any,
    config: any,
  ) => void;
}


declare global {
  interface Window {
    Plotly?: IPlotly
  }
}

if (config.mockServerEnabled) {
  makeServer({environment: 'development'});
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Suspense fallback={<div>Loading...</div>}>
    <I18nextProvider
      i18n={
        getI18n({
          ns: ['SimpleTools'],
        })}
    >
      <Provider store={store}>
        <App/>
      </Provider>
    </I18nextProvider>
  </Suspense>,
);
