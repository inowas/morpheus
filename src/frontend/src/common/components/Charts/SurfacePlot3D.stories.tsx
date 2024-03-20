// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";

import { Container } from "semantic-ui-react";
import React from "react";
import SurfacePlot3D from "./SurfacePlot3D";

export default {
  title: "Charts/SurfacePlot3D",
  component: SurfacePlot3D,
} as Meta<typeof SurfacePlot3D>;

const data = [
  [8.83, 8.89, 8.81, 8.87, 8.9, 8.87],
  [8.89, 8.94, 8.85, 8.94, 8.96, 8.92],
  [8.84, 8.9, 8.82, 8.92, 8.93, 8.91],
  [8.79, 8.85, 8.79, 8.9, 8.94, 8.92],
  [8.79, 8.88, 8.81, 8.9, 8.95, 8.92],
  [8.8, 8.82, 8.78, 8.91, 8.94, 8.92],
  [8.75, 8.78, 8.77, 8.91, 8.95, 8.92],
  [8.8, 8.8, 8.77, 8.91, 8.95, 8.94],
  [8.74, 8.81, 8.76, 8.93, 8.98, 8.99],
  [8.89, 8.99, 8.92, 9.1, 9.13, 9.11],
  [8.97, 8.97, 8.91, 9.09, 9.11, 9.11],
  [9.04, 9.08, 9.05, 9.25, 9.28, 9.27],
  [9, 9.01, 9, 9.2, 9.23, 9.2],
  [8.99, 8.99, 8.98, 9.18, 9.2, 9.19],
  [8.93, 8.97, 8.97, 9.18, 9.2, 9.18],
];

const add = (z: number[][], value: number) =>
  z.map((row) => row.map((cell) => cell + value));

export const Primary: StoryFn<typeof SurfacePlot3D> = () => (
  <Container fluid={true} style={{ border: "1px solid black" }}>
    <SurfacePlot3D
      data={[{ z: data, showscale: false, opacity: 1 }]}
      title={""}
    />
  </Container>
);

export const Secondary: StoryFn<typeof SurfacePlot3D> = () => {
  return (
    <Container>
      <SurfacePlot3D
        data={[
          { z: data, showscale: true, opacity: 1 },
          { z: add(data, 1), showscale: false, opacity: 1 },
        ]}
        title={""}
      />
    </Container>
  );
};
