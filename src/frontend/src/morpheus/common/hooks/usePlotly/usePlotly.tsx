import {useEffect, useState} from 'react';

interface IPlotly {
  newPlot: (
    containerId: HTMLElement | string,
    plotData: any[],
    layout: any,
    config: any
  ) => void;
}

const usePlotly = (): IPlotly | null => {
  const [plotly, setPlotly] = useState<IPlotly | null>(null);

  useEffect(() => {
    if ('undefined' === typeof window.Plotly) {
      const script = document.createElement('script');
      script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
      script.async = true;
      script.onload = () => {
        // Once the script is loaded, set the Plotly object in state
        setPlotly(window.Plotly as IPlotly);
      };
      document.head.appendChild(script);
    } else {
      // If Plotly is already available, set it in state
      setPlotly(window.Plotly as IPlotly);
    }
  }, []);

  return plotly;
};

export default usePlotly;
