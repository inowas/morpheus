import React from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {calcC, calcCTau, calculateDL, calculateR, calculateVx} from '../../application/useCalculations';
import {SETTINGS_CASE_FIXED_TIME, SETTINGS_INFILTRATION_ONE_TIME} from '../containers/T08Container';
import {getParameterValues} from '../../../common/helpers';
import {IT08} from '../../types/T08.type';

const renderContent = (settings: IT08['data']['settings'], t: number, c: number, x: number) => {
  if (settings.case === SETTINGS_CASE_FIXED_TIME) {
    return (
      <p>
        After fixed <strong>{t} days</strong> since introduction of constant point source the
        concentration is <strong>{c.toFixed(2)} mg/l</strong> at a distance of <strong>{x} m</strong> from
        constant point
        source.
      </p>
    );
  }

  return (
    <p>
      At a fixed distance of <strong>{x} m</strong> from constant point source the
      concentration is <strong>{c.toFixed(2)} mg/l</strong> after <strong>{t} days</strong> since introduction of
      constant point source.
    </p>
  );
};

interface IProps {
  settings: IT08['data']['settings'];
  parameters: IT08['data']['parameters'];
}

const Info = ({parameters, settings}: IProps) => {
  const {x, t, C0, tau, K, ne, I, alphaL, Kd} = getParameterValues(parameters);
  const vx = calculateVx(K, ne, I);
  const DL = calculateDL(alphaL, vx);
  const R = calculateR(ne, Kd);
  const C = (settings.infiltration === SETTINGS_INFILTRATION_ONE_TIME && t > tau) ? calcCTau(t, x, vx, R, DL, tau) : calcC(t, x, vx, R, DL);
  const c = C0 * C;

  return (
    <Message icon={true} info={true}>
      <Icon name="info circle" color="blue"/>
      <Message.Content>
        {renderContent(settings, t, c, x)}
      </Message.Content>
    </Message>

  );
};


export default Info;
