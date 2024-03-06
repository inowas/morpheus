import {Icon, Message} from 'semantic-ui-react';

import {IT14C} from '../../../types/T14.type';
import React from 'react';
import {calcDQ} from '../../../application/useCalculationsT14C';
import {getParameterValues} from 'simpletools/common/utils';

interface IProps {
  parameters: IT14C['parameters'];
}

const InfoT14C = ({parameters}: IProps) => {
  const {Qw, t, S, T, d, W, Kdash, bdash} = getParameterValues(parameters);
  const lambda = Kdash * W / bdash;
  const dQ = calcDQ(d, S, T, t, lambda, Qw);
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

export default InfoT14C;
