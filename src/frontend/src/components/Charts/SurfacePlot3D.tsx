import React, {useEffect} from 'react';

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

    if (!window.Plotly) {
      throw Error('Plotly not found.');
    }
    const Plotly = window.Plotly;
    const plotData = data.map((d) => ({...d, type: 'surface'}));
    const config = {responsive: true};
    const layout = {title, autosize: true, margin: {l: 0, r: 0, b: 0, t: 0}};
    Plotly.newPlot('plotlyContainer', plotData, layout, config);

  }, [data, title]);


  return (
    <div
      id="plotlyContainer"
      style={style || {width: '100%', height: '100%'}}
    ></div>);
};

export default SurfacePlot3D;
