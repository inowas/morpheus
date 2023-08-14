import React from 'react';
import Plot from 'react-plotly.js';

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

const SurfacePlot3D: React.FC<IProps> = ({data, title, style}) => (
  <Plot
    data={data.map((d) => ({...d, type: 'surface'}))}
    config={{responsive: true}}
    style={style || {width: '100%', height: '100%'}}
    layout={{title, autosize: true, margin: {l: 0, r: 0, b: 0, t: 0}}}
  />
);

export default SurfacePlot3D;

