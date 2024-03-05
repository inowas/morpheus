import {useEffect, useState} from 'react';
import './plotly.less';

const usePlotly = (): IPlotly | undefined => {
  const [plotly, setPlotly] = useState<IPlotly | undefined>(window.Plotly);

  useEffect(() => {
    if (undefined == window.Plotly) {
      const script = document.createElement('script');
      script.src = '/js/plotly-v1.58.5.min.js';
      script.async = true;
      script.onload = () => {
        // Once the script is loaded, set the Plotly object in state
        setPlotly(window.Plotly as IPlotly);
      };
      script.onerror = () => {
        throw Error('Plotly not found. ' +
          'Add ' +
          '<script src="/js/plotly"></script> or' +
          '<script src="https://cdn.plot.ly/plotly-latest.min.js"></script> ' +
          'to your index.html',
        );
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
