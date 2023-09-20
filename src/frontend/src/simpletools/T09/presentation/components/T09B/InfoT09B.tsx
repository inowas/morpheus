import React from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {getParameterValues} from '../../../../common/helpers';
import {calculateXT} from '../../../application/useCalculationsT09B';
import {IT09B} from '../../../types/T09.type';

interface IProps {
  parameters: IT09B['parameters'];
}


const InfoT09B = ({parameters}: IProps) => {
  const {b, i, df, ds} = getParameterValues(parameters);
  const xT = calculateXT(i, b, df, ds);

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
