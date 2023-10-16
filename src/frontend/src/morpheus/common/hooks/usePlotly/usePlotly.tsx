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

type IUsePlotly = () => IPlotly;

const usePlotly: IUsePlotly = () => {
  if (window.Plotly === undefined) {

    throw Error('Plotly not found. ' +
      'Add ' +
      '<script src="/js/plotly"></script> or' +
      '<script src="https://cdn.plot.ly/plotly-latest.min.js"></script> ' +
      'to your index.html',
    );
  }

  return window.Plotly as IPlotly;
};

export default usePlotly;
