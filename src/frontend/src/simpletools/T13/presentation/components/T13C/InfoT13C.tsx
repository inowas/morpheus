import {Icon, Message} from 'semantic-ui-react';
import {calculateTravelTimeT13C, calculateXwd} from '../../../application/useCalculations';

import {IT13C} from '../../../types/T13.type';
import React from 'react';
import {getParameterValues} from 'simpletools/common/utils';

interface IProps {
  parameters: IT13C['parameters'];
}

const InfoT13C = ({parameters}: IProps) => {
  const {W, K, L, hL, h0, ne, xi, xe} = getParameterValues(parameters);

  const xwd = calculateXwd(L, K, W, hL, h0);
  const t = calculateTravelTimeT13C(xe, W, K, ne, L + Math.abs(xwd), hL, xi);

  return (
    <Message icon={true} info={true}>
      <Icon name="info circle" color="blue"/>
      <Message.Content>
        <p>
          The regional system is divided into the two subdomains on either side of the water divide.<br/>
          The water divide is located at <strong>{xwd.toFixed(1)} m</strong>.<br/>
          Note that for this case the departure point x<sub>i</sub> is between |x<sub>wd</sub>| and
          L+|x<sub>wd</sub>|.
        </p>
        <p>
          The travel time between initial position and arrival location
          is <strong>{t.toFixed(1)} days</strong>.
        </p>
      </Message.Content>
    </Message>
  );
};
export default InfoT13C;
