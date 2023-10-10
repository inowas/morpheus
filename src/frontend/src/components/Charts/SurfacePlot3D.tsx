import React, {useEffect} from 'react';

declare global {
    interface Window {
        Plotly: any;
    }
}

interface IProps {
    title?: string;
    data: ISurfacePlotData[];
    style?: object;
}

interface ISurfacePlotData {
    z: I2DArr;
    showscale?: boolean;
    opacity?: number;
}

type I2DArr = Array<Array<number>>;

const SurfacePlot3D: React.FC<IProps> = ({data, title, style}) => {

  useEffect(() => {
    const timeOut = setTimeout(() => {
      const Plotly = window.Plotly;
      const plotData = data.map((d) => ({...d, type: 'surface'}));
      const config = {responsive: true};
      const layout = {title, autosize: true, margin: {l: 0, r: 0, b: 0, t: 0}};
      Plotly.newPlot('plotlyContainer', plotData, layout, config);
      return () => {
        Plotly.purge('plotlyContainer');
      };
    }, 300);

    return () => clearTimeout(timeOut);

  }, [data, title]);


  return (
    <div
      id="plotlyContainer"
      style={style || {width: '100%', height: '100%'}}
    ></div>);
};

export default SurfacePlot3D;
