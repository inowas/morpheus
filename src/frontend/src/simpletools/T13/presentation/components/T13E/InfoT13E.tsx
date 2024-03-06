import {Icon, Message} from 'semantic-ui-react';

import {IT13E} from '../../../types/T13.type';
import React from 'react';
import {calculateTravelTimeT13E} from '../../../application/useCalculations';
import {getParameterValues} from 'simpletools/common/utils';

interface IProps {
  parameters: IT13E['parameters'];
}

const InfoT13E = ({parameters}: IProps) => {
  const {Qw, ne, hL, h0, xi, x} = getParameterValues(parameters);
  const tMax = calculateTravelTimeT13E(xi, h0, hL, x, ne, Qw);

  if (x >= xi) {
    return (
      <Message icon={true} warning={true}>
        <Icon name="exclamation triangle" color="orange"/>
        <Message.Content>
          <p>Please be aware of the assigned coordinate system. Initial position <strong>x<sub>i</sub></strong> can not be smaller than location of well <strong>x</strong>.</p>
        </Message.Content>
      </Message>
    );
  }
  return (
    <Message icon={true} info={true}>
      <Icon name="info circle" color="blue"/>
      <Message.Content>
        <p>
          The travel time between initial position and arrival location
          is <strong>{tMax.toFixed(1)} days</strong>.
        </p>
      </Message.Content>
    </Message>
  );
};

export default InfoT13E;
