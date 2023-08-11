import React from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {calcDQ} from '../../../application/useCalculationsT14D';
import {getParameterValues} from '../../../../common/helpers';
import {IT14D} from '../../../types/T14.type';

interface IProps {
  parameters: IT14D['parameters'];
}

const InfoT14D = ({parameters}: IProps) => {
  const {Qw, t, S, T, d, W, Kdash, Bdashdash, Sigma, bdash} = getParameterValues(parameters);
  const lambda = Kdash * W / Bdashdash;
  const deps = S / Sigma;
  const dlam = lambda * d / T;
  const dk = ((Kdash / bdash) * d * d) / T;
  const dQ = calcDQ(d, S, T, t, lambda, Kdash, Bdashdash, Qw, deps, dlam, dk);
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

export default InfoT14D;
