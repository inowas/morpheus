import {IT13B, SETTINGS_SELECTED_H0, SETTINGS_SELECTED_HL, SETTINGS_SELECTED_NOTHING} from '../../../types/T13.type';
import {Icon, Message} from 'semantic-ui-react';
import {calculateTravelTimeT13B, calculateXwd} from '../../../application/useCalculations';

import React from 'react';
import {getParameterValues} from 'simpletools/common/utils';

interface IProps {
  parameters: IT13B['parameters'];
  settings: IT13B['settings'];
}

const InfoT13B = ({parameters, settings}: IProps) => {
  const {W, K, L, hL, h0, ne, xi, xe} = getParameterValues(parameters);
  const {selected} = settings;

  if (selected === SETTINGS_SELECTED_NOTHING) {
    return null;
  }

  const xwd = Number(calculateXwd(L, K, W, hL, h0).toFixed(1));

  let t = 0;
  if (selected === SETTINGS_SELECTED_H0) {
    t = calculateTravelTimeT13B(xe, W, K, ne, (xwd * 1), h0, xi);
  }
  if (selected === SETTINGS_SELECTED_HL) {
    t = calculateTravelTimeT13B(xe, W, K, ne, (L - xwd), hL, xi);
  }

  return (
    <Message icon={true} info={true}>
      <Icon name="info circle" color="blue"/>
      <Message.Content>
        <p>
          The travel time between initial position and arrival location
          is <strong>{t.toFixed(1)} days</strong>.
        </p>
      </Message.Content>
    </Message>
  );
};
export default InfoT13B;
