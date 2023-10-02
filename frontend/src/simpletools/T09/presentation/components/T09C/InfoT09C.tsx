import React from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {getParameterValues} from '../../../../common/helpers';
import {calculateQ, calculateZ, calculateZCrit} from '../../../application/useCalculationsT09С';
import {IT09C} from '../../../types/T09.type';

interface IProps {
  parameters: IT09C['parameters'];
}

const InfoT09C = ({parameters}: IProps) => {
  const {q, k, d, df, ds} = getParameterValues(parameters);
  const z = calculateZ(q, k, d, df, ds);
  const qmax = calculateQ(k, d, df, ds);
  const zCrit = calculateZCrit(d);

  if (Number(z) > Number(zCrit)) {
    return (
      <Message icon={true} warning={true}>
        <Icon name="exclamation triangle" color="orange"/>
        <Message.Content>
          <p>The calculated upconing level of <strong>{z.toFixed(2)} m </strong>
            is higher than the critical elevation of <strong>{zCrit.toFixed(1)} m</strong>.
            At the current pumping rate, saltwater might enter the well.
            We recommend a maximum pumping rate of <strong>{qmax.toFixed(2)} m<sup>3</sup>/d</strong>.
          </p>
        </Message.Content>
      </Message>
    );
  }

  if (df >= ds) {
    return null;
  }

  return (
    <Message icon={true} info={true}>
      <Icon name="info circle" color="blue"/>
      <Message.Content>
        <p>
          The calculated upconing level of <strong>{z.toFixed(2)} m </strong>
          is lower than the critical elevation of <strong>{zCrit.toFixed(1)} m </strong>
          so saltwater shouldn&apos;t enter the well. However, we recommend a maximum
          pumping rate of <strong>{qmax.toFixed(2)} m<sup>3</sup>/d</strong>.
        </p>
      </Message.Content>
    </Message>
  );
};

export default InfoT09C;
