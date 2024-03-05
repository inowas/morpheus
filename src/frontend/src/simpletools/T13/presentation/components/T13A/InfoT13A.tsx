import React from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {calculateTravelTimeT13A} from '../../../application/useCalculations';
import {getParameterValues} from 'simpletools/common/utils';
import {IT13A} from '../../../types/T13.type';

interface IProps {
  parameters: IT13A['parameters'];
}

const InfoT13A = ({parameters}: IProps) => {
  const {W, K, ne, L, hL, xi, xe} = getParameterValues(parameters);
  const t = calculateTravelTimeT13A(xe, W, K, ne, L, hL, xi);
  return (
    <Message icon={true} info={true}>
      <Icon name="info circle" color="blue"/>
      <p>
        The travel time between initial position and arrival location
        is <strong>{t.toFixed(1)} days</strong>.
      </p>
    </Message>
  );
};

export default InfoT13A;
