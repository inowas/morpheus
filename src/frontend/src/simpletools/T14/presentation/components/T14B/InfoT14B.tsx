import {Icon, Message} from 'semantic-ui-react';

import {IT14B} from '../../../types/T14.type';
import React from 'react';
import {calcDQ} from '../../../application/useCalculationsT14B';
import {getParameterValues} from 'simpletools/common/utils';

interface IProps {
  parameters: IT14B['parameters'];
}

const InfoT14B = ({parameters}: IProps) => {
  const {d, S, T, t, K, Kdash, bdash, Qw} = getParameterValues(parameters);
  const L = K * bdash / Kdash;
  const dQ = calcDQ(d, S, T, t, L, Qw);
  return (
    <div data-testid="info-container">
      <Message icon={true} info={true}>
        <Icon name="info circle" color="blue"/>
        <Message.Content>
          <p>
            The calculated river drawdown is <strong>{dQ.toFixed(1)} m³/d</strong>.
          </p>
        </Message.Content>
      </Message>
    </div>
  );
};

export default InfoT14B;
