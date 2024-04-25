interface GeometryPoint {
  type: string;
  coordinates: [number, number];
}

interface GeometryLineString {
  type: string;
  coordinates: [number, number][];
}

interface GeometryPolygon {
  type: string;
  coordinates: [[number, number][]];
}

interface ObservationData {
  date_time: string;
  stage?: number;
  conductance?: number;
  pumping_rate?: number;
  recharge_rate?: number;
  river_stage?: number;
  riverbed_bottom?: number;
}

interface Observation {
  observation_name?: string;
  observation_id: string;
  geometry: GeometryPoint;
  raw_data: ObservationData[];
}

export interface IBoundaries {
  id: string;
  type: string;
  name: string;
  geometry: GeometryPoint[] | GeometryLineString[] | GeometryPolygon[] | any;
  affected_cells: {
    type: string;
    shape: [number, number] | number[];
    data: [number, number][] | number[][];
  };
  affected_layers: string[];
  observations: Observation[];
  enabled: boolean;
}
