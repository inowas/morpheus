import {calculateMounding} from '../infrastructure';

interface IUseCalculateMounding {
  calculateHi: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
  calculateHMax: (w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
}

const useCalculateMounding = (): IUseCalculateMounding => ({
  calculateHi: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => calculateMounding({x, y, w, L, W, hi, Sy, K, t}),
  calculateHMax: (w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => calculateMounding({x: 0, y: 0, w, L, W, hi, Sy, K, t}) + hi,
});

export default useCalculateMounding;
