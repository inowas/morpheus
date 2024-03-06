import {Icon, Message} from 'semantic-ui-react';

import {IT09B} from '../../../types/T09.type';
import React from 'react';
import {getParameterValues} from 'simpletools/common/utils';

interface DataSet {
  x: number;
  z?: number;
  b: number;
}

interface IUseCalculate {
  range: (start: number, stop: number, step: number) => number[];
  calculateZofX: (x: number, i: number, b: number, df: number, ds: number) => number;
  calculateZ: (i: number, b: number, df: number, ds: number) => number;
  calculateL: (i: number, b: number, df: number, ds: number) => number;
  calculateXT: (i: number, b: number, rho_f: number, rho_s: number) => number;
  calculateDiagramData: (
    i: number,
    b: number,
    df: number,
    ds: number,
    start: number,
    stop: number,
    step: number
  ) => DataSet[];
}

interface IProps {
  parameters: IT09B['parameters'];
  calculation: IUseCalculate;
}

const InfoT09B = ({parameters, calculation}: IProps) => {
  const {b, i, df, ds} = getParameterValues(parameters);
  const xT = calculation.calculateXT(i, b, df, ds);

  return (
    <Message icon={true} info={true}>
      <Icon name="info circle" color="blue"/>
      <Message.Content>
        <p>
          Inland extent of the toe of the saltwater interface at the base of the aquifer
          is<br/> x<sub>T</sub> = <strong>{xT.toFixed(2)} m</strong>.
        </p>
      </Message.Content>
    </Message>
  );
};

export default InfoT09B;
