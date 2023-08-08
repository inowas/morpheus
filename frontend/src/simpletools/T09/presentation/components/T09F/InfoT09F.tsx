import React from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {getParameterValues} from '../../../../common/helpers';
import {calcDeltaXt, calcH, calcI, calcNewXt, calcXt} from '../../../application/useCalculationsT09F';
import {IT09F} from '../../../types/T09.type';

interface IProps {
  parameters: IT09F['parameters'];
}

const InfoT09F = ({parameters}: IProps) => {
  const {dz, k, z0, l, w, theta, x, df, ds} = getParameterValues(parameters);

  const newXt = calcNewXt({dz, k, z0, l, w, theta, df, ds});
  const xt = calcXt({k, z0, l, w, df, ds});
  const dxt = calcDeltaXt({dz, k, z0, l, w, theta, df, ds});
  const h = calcH({k, l, w, x, df, ds});
  const I = calcI({dz, k, l, w, theta, x, df, ds});
  return (
    <Message icon={true} info={true}>
      <Icon name="info circle" color="blue"/>
      <Message.Content>
        <p>
          The initial toe of the saltwater freshwater interface is
          located <strong>{xt.toFixed(1)} m</strong> from the inland boundary
          or <strong>{(l - xt).toFixed(1)} m</strong> from the coast.<br/><br/>
          Due to sea level rise of <strong>{dz} m</strong>, the toe of the interface will
          move <strong>{dxt.toFixed(1)} m</strong> inland. The new position of the toe of the interface is
          thus <strong>{(newXt).toFixed(1)} m</strong> from the inland boundary.<br/><br/>
          At a distance of <strong>{x} m</strong> from the inland boundary, the initial water table head
          is <strong>{h.toFixed(1)} m</strong> above sea level and due to sea level rise
          of <strong>{dz} m</strong>, the water table will rise about <strong>{I.toFixed(2)} m</strong> at
          that position.
        </p>
      </Message.Content>
    </Message>
  );
};

export default InfoT09F;
