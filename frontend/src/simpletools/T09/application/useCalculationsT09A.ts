interface IUseCalculate {
  calculateZ: (h: number, df: number, ds: number) => number;
  calculateDiagramData: (h: number, df: number, ds: number) => [{
    name: string;
    h: number;
    z: number;
  }];
}

const calculateZ = (h: number, df: number, ds: number) => {
  return (df * h) / (ds - df);
};

const useCalculationsT09A = (): IUseCalculate => ({
  calculateZ: calculateZ,
  calculateDiagramData: (h, df, ds): [{
    name: string;
    h: number;
    z: number;
  }] => {
    const z = calculateZ(h, df, ds);
    return [{name: '', h, z}];
  },
});

export default useCalculationsT09A;
