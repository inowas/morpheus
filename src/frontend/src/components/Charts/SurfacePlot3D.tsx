import React, {useEffect} from 'react';
import {usePlotly} from 'common/hooks';

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
  const plotly = usePlotly();

  useEffect(() => {
    if (!plotly) {
      throw Error('Plotly not found.');
    }
    const plotData = data.map((d) => ({...d, type: 'surface'}));
    const config = {responsive: true};
    const layout = {title, autosize: true, margin: {l: 0, r: 0, b: 0, t: 0}};
    plotly.newPlot('plotlyContainer', plotData, layout, config);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, title]);


  return (
    <div id="plotlyContainer" style={style || {width: '100%', height: '100%'}}></div>
  );
};

export default SurfacePlot3D;
