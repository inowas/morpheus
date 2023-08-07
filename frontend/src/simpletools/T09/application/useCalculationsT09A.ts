export function calculateZ(h: number, df: number, ds: number) {
  return (df * h) / (ds - df);
}

export function calculateDiagramData(h: number, df: number, ds: number) {
  const z = calculateZ(h, df, ds);
  return [{name: '', h, z}];
}
