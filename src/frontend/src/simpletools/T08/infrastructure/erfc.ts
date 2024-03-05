import {erf} from './index';

const erfc = (x: number) => {
  return 1 - erf(x);
};
export default erfc;
