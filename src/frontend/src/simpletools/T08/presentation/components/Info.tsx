import {Icon, Message} from 'semantic-ui-react';
import {SETTINGS_CASE_FIXED_TIME, SETTINGS_INFILTRATION_ONE_TIME} from '../containers/T08Container';

import {IT08} from '../../types/T08.type';
import React from 'react';
import {getParameterValues} from 'simpletools/common/utils';

interface ICalculation {
  calcC: (t: number, x: number, vx: number, R: number, DL: number) => number;
  calcCTau: (t: number, x: number, vx: number, R: number, DL: number, tau: number) => number;
  calculateVx: (K: number, ne: number, I: number) => number;
  calculateDL: (alphaL: number, vx: number) => number;
  calculateR: (ne: number, Kd: number) => number;
  calculateDiagramData: (
    settings: IT08['settings'],
    vx: number,
    DL: number,
    R: number,
    C0: number,
    xMax: number,
    tMax: number,
    tau: number
  ) => any[];
}

interface IProps {
  settings: IT08['settings'];
  parameters: IT08['parameters'];
  calculation: ICalculation;
}

const renderContent = (settings: IT08['settings'], t: number, c: number, x: number) => {
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


const Info = ({parameters, settings, calculation}: IProps) => {
  const {x, t, C0, tau, K, ne, I, alphaL, Kd} = getParameterValues(parameters);
  const vx = calculation.calculateVx(K, ne, I);
  const DL = calculation.calculateDL(alphaL, vx);
  const R = calculation.calculateR(ne, Kd);
  const C = (settings.infiltration === SETTINGS_INFILTRATION_ONE_TIME && t > tau) ? calculation.calcCTau(t, x, vx, R, DL, tau) : calculation.calcC(t, x, vx, R, DL);
  const c = C0 * C;

  return (
    <div data-testid="info-container">
      <Message icon={true} info={true}>
        <Icon name="info circle" color="blue"/>
        <Message.Content>
          {renderContent(settings, t, c, x)}
        </Message.Content>
      </Message>
    </div>
  );
};


export default Info;
