import React, {Suspense} from 'react';
import {createRoot} from 'react-dom/client';

import App from './App';
import {I18nextProvider} from 'react-i18next';
import {getI18n} from './i18n';

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
      <App/>
    </I18nextProvider>
  </Suspense>,
);
