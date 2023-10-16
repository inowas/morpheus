import React from 'react';

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

const PlotlyWrapper = () => {
  if (window.Plotly === undefined) {
    <script src="js/plotly-v1.58.5.min.js"></script>;
    window.Plotly = require('');
  }

  return window.Plotly as IPlotly;
};

export default PlotlyWrapper;
