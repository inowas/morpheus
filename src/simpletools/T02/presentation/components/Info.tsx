import React from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {IT02} from '../../types/T02.type';

interface IProps {
  parameters: IT02['parameters'];
  mounding: IMounding;
}

interface IMounding {
  calculateHi: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
  calculateHMax: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
}


export const getParameterValues = (arr: IT02['parameters']) => {
  let returnValue: { [key: string]: any } = {};

  arr.forEach((item) => {
    returnValue[item.id] = item.value;
  });

  return returnValue;
};

const Info = (props: IProps) => {
  const {L, W, w, hi, Sy, K, t} = getParameterValues(props.parameters);
  const hhi = props.mounding.calculateHi(0, 0, w, L, W, hi, Sy, K, t);
  const hMax = (hhi + hi);

  return (
    <Message icon={true} info={true}>
      <Icon name='info circle' color='blue'/>
      <Message.Content>
        <p>
          The resulting groundwater mound is&nbsp;<strong>{hhi.toFixed(2)}&nbsp;m </strong>
          and the groundwater level will rise up to&nbsp;<strong>{hMax.toFixed(2)}&nbsp;m</strong>.
        </p>
      </Message.Content>
    </Message>
  );
};

export default Info;
