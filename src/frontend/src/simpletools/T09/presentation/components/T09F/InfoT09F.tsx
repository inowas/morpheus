import {Icon, Message} from 'semantic-ui-react';

import {IT09F} from '../../../types/T09.type';
import React from 'react';
import {getParameterValues} from 'simpletools/common/utils';

interface IUseCalculate {
  dRho: (rHof: number, rHos: number) => number;
  calcXt: (params: { k: number; z0: number; l: number; w: number; df: number; ds: number }) => number;
  calcDeltaXt: (params: { dz: number; k: number; z0: number; l: number; w: number; theta: number; df: number; ds: number }) => number;
  calcNewXt: (params: { dz: number; k: number; z0: number; l: number; w: number; theta: number; df: number; ds: number }) => number;
  calcH: (params: { k: number; l: number; w: number; x: number; df: number; ds: number }) => number;
  calcI: (params: { dz: number; k: number; l: number; w: number; theta: number; x: number; df: number; ds: number }) => number;
}

interface IProps {
  parameters: IT09F['parameters'];
  calculation: IUseCalculate;
}

const InfoT09F = ({parameters, calculation}: IProps) => {
  const {dz, k, z0, l, w, theta, x, df, ds} = getParameterValues(parameters);

  const newXt = calculation.calcNewXt({dz, k, z0, l, w, theta, df, ds});
  const xt = calculation.calcXt({k, z0, l, w, df, ds});
  const dxt = calculation.calcDeltaXt({dz, k, z0, l, w, theta, df, ds});
  const h = calculation.calcH({k, l, w, x, df, ds});
  const I = calculation.calcI({dz, k, l, w, theta, x, df, ds});
  return (
    <Message icon={true} info={true}>
      <Icon name="info circle" color="blue"/>
      <Message.Content>
        <p>
          The initial toe of the saltwater freshwater interface is
          located <strong>{xt.toFixed(1)} m</strong> from the inland boundary
          or <strong>{(l - xt).toFixed(1)} m</strong> from the coast.<br/><br/>
          Due to sea level rise of <strong>{dz} m</strong>, the toe of the interface will
          move <strong>{dxt.toFixed(1)} m</strong> inland. The new position of the toe of the interface is
          thus <strong>{(newXt).toFixed(1)} m</strong> from the inland boundary.<br/><br/>
          At a distance of <strong>{x} m</strong> from the inland boundary, the initial water table head
          is <strong>{h.toFixed(1)} m</strong> above sea level and due to sea level rise
          of <strong>{dz} m</strong>, the water table will rise about <strong>{I.toFixed(2)} m</strong> at
          that position.
        </p>
      </Message.Content>
    </Message>
  );
};

export default InfoT09F;
