import React, {useEffect, useRef} from 'react';
import cloneDeep from 'lodash.clonedeep';
import {usePlotly} from 'common/hooks';

interface IPlotly {
  newPlot: (
    containerId: HTMLElement | string,
    plotData: any[],
    layout: any,
    config: any,
  ) => void;
}

interface IProps {
  data: ISurfacePlotData;
  title?: string;
  basinWidth: number;
  basinLength: number;
  chartHeight?: number;
  id: string;
}

interface ISurfacePlotData {
  x: number[];
  y: number[];
  z: number[][];
}

const initialPlotlyRefValue = {
  newPlot: (containerId: HTMLElement | string,
    plotData: any[],
    layout: any,
    config: any) => {
  },
};

const colorScale: string | string[] | Array<[number, string]> = [
  [0.0, 'rgb(49,54,149)'],
  [0.11, 'rgb(69,117,180)'],
  [0.22, 'rgb(116,173,209)'],
  [0.33, 'rgb(171,217,233)'],
  [0.44, 'rgb(224,243,248)'],
  [0.55, 'rgb(254,224,144)'],
  [0.66, 'rgb(253,174,97)'],
  [0.77, 'rgb(244,109,67)'],
  [0.88, 'rgb(215,48,39)'],
  [1.0, 'rgb(165,0,38)'],
];

const Chart: React.FC<IProps> = ({data, title, basinLength, basinWidth, chartHeight, id}) => {
  const containerId = `plotlyContainer_${id}`;
  const plotlyRef = useRef<IPlotly | undefined>(initialPlotlyRefValue);
  const Plotly = usePlotly();

  const createPlot = (plData: ISurfacePlotData, plTitle: string | undefined, plBasinLength: number, plBasinWidth: number, plChartHeight: number | undefined, plContainerId: string) => {
    const maxZ = Math.max(...plData.z.map((row) => Math.max(...row)));
    const minZ = Math.min(...plData.z.map((row) => Math.min(...row)));
    const deltaZ = maxZ - minZ;
    const surfaceElevation = maxZ + deltaZ;
    const basinElevation = surfaceElevation - 0.25 * deltaZ;
    // Update the plot data stored in the ref
    const plotData = [
      {
        name: 'Head',
        x: plData.x,
        y: plData.y,
        z: plData.z,
        type: 'surface',
        colorscale: colorScale,
        showscale: true,
        orientation: 'v',
      },
      {
        name: 'Basin',
        x: [-plBasinLength / 2 - 1, -plBasinLength / 2, plBasinLength / 2, plBasinLength / 2 + 1],
        y: [-plBasinWidth / 2 - 1, -plBasinWidth / 2, plBasinWidth / 2, plBasinWidth / 2 + 1],
        z: [
          [surfaceElevation, surfaceElevation, surfaceElevation, surfaceElevation],
          [surfaceElevation, basinElevation, basinElevation, surfaceElevation],
          [surfaceElevation, basinElevation, basinElevation, surfaceElevation],
          [surfaceElevation, surfaceElevation, surfaceElevation, surfaceElevation],
        ],
        type: 'surface',
        colorscale: [
          [0.0, 'rgb(49,54,149)'],
          [1.0, 'rgb(0,0,0)'],
        ],
        showscale: false,
        opacity: 0.2,
        orientation: 'v',
      },
    ];
    // @ts-ignore
    const config = {responsive: true};
    const layout = {
      plot_bgcolor: 'rgb(224,243,248)',
      title: plTitle,
      autosize: true,
      height: plChartHeight !== undefined ? plChartHeight : undefined,
      margin: {l: 0, r: 0, b: 0, t: 0},
      scene: {
        camera: {
          up: {
            x: 1,
            y: 0,
            z: 1,
          },
          center: {
            x: 0,
            y: 0,
            z: 0,
          },
          eye: {
            x: 0,
            y: 0,
            z: 1,
          },
        },
        aspectmode: 'manual',
        aspectratio: {
          y: 1,
          x: (Math.max(...plData.x) - Math.min(...plData.x)) / (Math.max(...plData.y) - Math.min(...plData.y)),
          z: 0.2,
        },
        xaxis: {
          visible: true,
        },
        yaxis: {
          visible: true,
        },
        zaxis: {
          visible: false,
        },
      },
    };
    if (plotlyRef.current) {
      plotlyRef.current.newPlot(plContainerId, plotData, layout, config);
    }
  };

  useEffect(() => {
    if (Plotly) {
      // If Plotly is available, set it in the ref
      plotlyRef.current = cloneDeep(Plotly);
      createPlot(data, title, basinLength, basinWidth, chartHeight, containerId);
    }
  }, [Plotly, data, title, basinLength, basinWidth, chartHeight, containerId]);


  return <div
    id={containerId}
    className={chartHeight !== undefined ? 'plotlyContainer' : 'plotlyContainerModal'}
  ></div>;

};

export default Chart;
