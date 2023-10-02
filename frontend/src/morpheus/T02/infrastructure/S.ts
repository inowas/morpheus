import erf from './erf';
import numericallyIntegrate from './numericallyIntegrate';

type IS = (input: ISInput) => number;

interface ISInput {
  alpha: number;
  beta: number;
}

const S = ({alpha, beta}: ISInput) => {
  const func = (tau: number) => {
    if (0 !== tau) {
      const sqrtTau = Math.sqrt(tau);
      return erf({x: alpha / sqrtTau}) * erf({x: beta / sqrtTau});
    }

    return 0;
  };

  return numericallyIntegrate({a: 0, b: 1, dx: 0.001, f: func});
};

export default S;
export type {IS};
