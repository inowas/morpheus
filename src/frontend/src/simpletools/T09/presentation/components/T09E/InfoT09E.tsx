import {Icon, Message} from 'semantic-ui-react';

import {IT09E} from '../../../types/T09.type';
import React from 'react';
import {getParameterValues} from 'simpletools/common/utils';

interface IUseCalculate {
  dRho: (rHof: number, rHos: number) => number;
  calcXtQ0Flux: (k: number, z0: number, dz: number, l: number, w: number, i: number, alpha: number,) => [number, number];
  calcXtQ0Head: (K: number, z0: number, dz: number, L: number, W: number, hi: number, alpha: number,) => [number, number, boolean, boolean];
  calculateDiagramData: (xt: number, z0: number, xtSlr: number, dz: number, isValid: boolean) => { xt: number; z0?: number; z0_new: number }[];
}

interface IProps {
  parameters: IT09E['parameters'];
  settings: IT09E['settings'];
  calculation: IUseCalculate;
}

const InfoT09E = ({parameters, settings, calculation}: IProps) => {
  const {k, z0, l, w, dz, hi, i, df, ds} = getParameterValues(parameters);
  const {method} = settings;

  let data;
  let isValid = true;
  const alpha = calculation.dRho(df, ds);

  if ('constHead' === method) {
    const xtQ0Head1 = calculation.calcXtQ0Head(k, z0, 0, l, w, hi, alpha);
    const xt = xtQ0Head1[0];
    isValid = xtQ0Head1[3];

    const xtQ0Head2 = calculation.calcXtQ0Head(k, z0, dz, l, w, hi - dz, alpha);
    const xtSlr = xtQ0Head2[0]; // slr: after sea level rise

    if (isValid) {
      isValid = xtQ0Head2[3];
    }

    data = calculation.calculateDiagramData(xt, z0, xtSlr, z0 + dz, isValid);

    if (2 > data.length) {
      return <Message icon={true} info={true}>
        <Icon name="info circle" color="blue"/>
        <Message.Content>
          <p>
            Invalid input parameters. Please check the input parameters.
          </p>
        </Message.Content>
      </Message>;
    }

    return (
      <Message icon={true} info={true}>
        <Icon name="info circle" color="blue"/>
        <Message.Content>
          <p>
            With a hydraulic gradient i of <strong>{-i.toFixed(3)} m/m</strong>, the calculated distance of the toe of
            interface prior sea level rise is <strong>{Math.abs(data[1].xt).toFixed(1)} m</strong>. The distance of the toe
            of the interface after sea level rise is <strong>{Math.abs(data[2].xt).toFixed(1)} m</strong>.
            Therefore, the toe of the freshwater-saltwater interface will move <strong>{(Math.abs(data[2].xt)
            - Math.abs(data[1].xt)).toFixed(2)}&nbsp;m</strong> inland caused by sea level rise.
          </p>
        </Message.Content>
      </Message>
    );
  }

  if ('constFlux' === method) {
    const [xt, xtSlr] = calculation.calcXtQ0Flux(k, z0, dz, l, w, i, alpha);
    data = calculation.calculateDiagramData(xt, z0, xtSlr, z0 + dz, isValid);

    return (
      <Message icon={true} info={true}>
        <Icon name="info circle" color="blue"/>
        <Message.Content>
          <p>
            With a hydraulic gradient i of <strong>{-i.toFixed(3)} m/m</strong>, the calculated distance of the toe of
            interface prior sea level rise is <strong>{Math.abs(data[1].xt).toFixed(1)} m</strong>. The distance of the
            toe of the interface after sea level rise is <strong>{Math.abs(data[2].xt).toFixed(1)} m</strong>.
            Therefore, the toe of the freshwater-saltwater interface will move <strong>{(Math.abs(data[2].xt)
            - Math.abs(data[1].xt)).toFixed(2)}&nbsp;m</strong> inland caused by sea level rise.
          </p>
        </Message.Content>
      </Message>
    );
  }

  return null;
};

export default InfoT09E;
