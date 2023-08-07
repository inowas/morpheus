import React from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {getParameterValues} from '../../../../common/helpers';
import {IT09A} from '../../../types/T09.type';

interface IProps {
  parameters: IT09A['parameters'];
}

const InfoT09A = ({parameters}: IProps) => {
  const calculateZ = (h: number, df: number, ds: number) => {
    return (df * h) / (ds - df);
  };
  const {h, df, ds} = getParameterValues(parameters);
  const z = calculateZ(h, df, ds);

  return (
    <Message icon={true} info={true}>
      <Icon name="info circle" color="blue"/>
      <Message.Content>
        <p>
          Thickness of freshwater below sea level z is <strong>{z.toFixed(1)} m</strong>.
        </p>
      </Message.Content>
    </Message>
  );
};

export default InfoT09A;
