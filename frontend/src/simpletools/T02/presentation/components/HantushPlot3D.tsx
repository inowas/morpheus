import React from 'react';
import Plot from 'react-plotly.js';
import {ColorScale} from 'plotly.js';

interface IProps {
  data: ISurfacePlotData;
  title?: string;
  basinWidth: number;
  basinLength: number;
}

interface ISurfacePlotData {
  x: number[];
  y: number[];
  z: number[][];
}

const colorScale: ColorScale = [
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

const HantushPlot3D: React.FC<IProps> = ({data, title, basinLength, basinWidth}) => {
  const maxZ = Math.max(...data.z.map((row) => Math.max(...row)));
  const minZ = Math.min(...data.z.map((row) => Math.min(...row)));
  const deltaZ = maxZ - minZ;
  const surfaceElevation = maxZ + deltaZ;
  const basinElevation = surfaceElevation - 0.25 * deltaZ;

  return (
    <Plot
      data={[
        {
          name: 'Head',
          x: data.x,
          y: data.y,
          z: data.z,
          type: 'surface',
          colorscale: colorScale,
          showscale: true,
          orientation: 'v',
        },
        {
          name: 'Basin',
          x: [-basinLength / 2 - 1, -basinLength / 2, basinLength / 2, basinLength / 2 + 1],
          y: [-basinWidth / 2 - 1, -basinWidth / 2, basinWidth / 2, basinWidth / 2 + 1],
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
      ]}
      config={{responsive: true}}
      layout={{
        plot_bgcolor: 'rgb(224,243,248)',
        title: title,
        autosize: false,
        height: 300,
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
            x: (Math.max(...data.x) - Math.min(...data.x)) / (Math.max(...data.y) - Math.min(...data.y)),
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
      }}
    />
  );
};

export default HantushPlot3D;
