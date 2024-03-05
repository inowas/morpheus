import React from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {getParameterValues} from 'simpletools/common/utils';
import {IT09D} from '../../../types/T09.type';

interface IUseCalculate {
  dRo: (rhof: number, rhos: number) => number;
  calcXt: (
    k: number,
    b: number,
    q: number,
    Qw: number,
    xw: number,
    rhof: number,
    rhos: number,
    AqType?: string
  ) => number;
  calculateZCrit: (d: number) => number;
  calculateQCrit: (q: number, mu: number, xw: number) => number;
  calcLambda: (
    k: number,
    b: number,
    q: number,
    xw: number,
    rhof: number,
    rhos: number,
    AqType: string
  ) => number;
  calcMu: (Lambda: number) => number;
  calculateDiagramData: (q: number, mu: number, xw: number) => { xw: number; Qcrit: number }[];
}

interface IProps {
  parameters: IT09D['parameters'];
  settings: IT09D['settings'];
  calculation: IUseCalculate;
}

const InfoT09D = ({parameters, settings, calculation}: IProps) => {
  const {k, b, q, Q, xw, rhof, rhos} = getParameterValues(parameters);
  const {AqType} = settings;

  const lambda = calculation.calcLambda(k, b, q, xw, rhof, rhos, AqType);
  const mu = calculation.calcMu(lambda);
  const qCrit = calculation.calculateQCrit(q, mu, xw);
  const xT = calculation.calcXt(k, b, q, Q, xw, rhof, rhos);

  if (Q >= qCrit) {
    return (
      <Message icon={true} warning={true}>
        <Icon name="exclamation triangle" color="orange"/>
        <Message.Content>
          <p>
            With the chosen pumping rate of <strong>{Q.toFixed(0)} m³/d</strong>, seawater will intrude
            about <strong>{xT.toFixed(1)} m</strong> inland, which is
            higher than the distance from the well to the coast line.<br/>
            Seawater will most likely intrude the well.<br/>
            The critical well discharge is <strong>{qCrit.toFixed(0)} m³/d</strong>.<br/>
            The pumping rate needs to be kept below that threshold so that seawater will not intrude the
            well.
          </p>
        </Message.Content>
      </Message>
    );
  }

  return (
    <Message icon={true} info={true}>
      <Icon name="info circle" color="blue"/>
      <Message.Content>
        <p>
          With the chosen pumping rate of <strong>{Q.toFixed(0)} m³/d</strong>, seawater will intrude
          about <strong>{xT.toFixed(1)} m</strong> inland, which is lower than
          the distance from the well to the coast line and hence no seawater will intrude the well.<br/>
          The critical well discharge is <strong>{qCrit.toFixed(0)} m³/d</strong>.<br/>
          The pumping rate needs to be kept below that threshold so that seawater will not intrude the well.
        </p>
      </Message.Content>
    </Message>
  );
};

export default InfoT09D;
