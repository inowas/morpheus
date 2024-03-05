import React from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {calcDQ} from '../../../application/useCalculationsT14A';
import {getParameterValues} from 'simpletools/common/utils';
import {IT14A} from '../../../types/T14.type';

interface IProps {
  parameters: IT14A['parameters'];
}

const InfoT14A = ({parameters}: IProps) => {
  const {Qw, d, S, T, t} = getParameterValues(parameters);
  const DQ = calcDQ(Qw, d, S, T, t);
  return (
    <div data-testid="info-container">
      <Message icon={true} info={true}>
        <Icon name="info circle" color="blue"/>
        <Message.Content>
          <p>
            The calculated river drawdown is <strong>{DQ.toFixed(1)} m³/d</strong>.
          </p>
        </Message.Content>
      </Message>
    </div>
  );
};

export default InfoT14A;
