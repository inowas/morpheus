import React from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {getParameterValues} from '../../../../common/helpers';
import {calculateDiagramData, calcXtQ0Flux, calcXtQ0Head, dRho} from '../../../application/useCalculationsT09E';
import {IT09E} from '../../../types/T09.type';

interface IProps {
  parameters: IT09E['parameters'];
  settings: IT09E['settings'];
}

const InfoT09E = ({parameters, settings}: IProps) => {
  const {k, z0, l, w, dz, hi, i, df, ds} = getParameterValues(parameters);
  const {method} = settings;

  let data;
  let isValid = true;
  const alpha = dRho(df, ds);

  if ('constHead' === method) {
    const xtQ0Head1 = calcXtQ0Head(k, z0, 0, l, w, hi, alpha);
    const xt = xtQ0Head1[0];
    isValid = xtQ0Head1[3];

    const xtQ0Head2 = calcXtQ0Head(k, z0, dz, l, w, hi - dz, alpha);
    const xtSlr = xtQ0Head2[0]; // slr: after sea level rise

    if (isValid) {
      isValid = xtQ0Head2[3];
    }

    data = calculateDiagramData(xt, z0, xtSlr, z0 + dz, isValid);

    return (
      <Message icon={true} info={true}>
        <Icon name="info circle" color="blue"/>
        <Message.Content>
          <p>
            With a hydraulic gradient i of <strong>{-i.toFixed(3)} m/m</strong>, the calculated distance of the toe of
            interface prior sea level rise is <strong>{Math.abs(data[1].xt).toFixed(1)} m</strong>. The distance of the toe
            of the interface after sea level rise is <strong>{Math.abs(data[2].xt).toFixed(1)} m</strong>.
            Therefore, the toe of the freshwater-saltwater interface will move <strong>{(Math.abs(data[2].xt)
            - Math.abs(data[1].xt)).toFixed(2)}&nbsp;m</strong> inland caused by sea level rise.
          </p>
        </Message.Content>
      </Message>
    );
  }

  if ('constFlux' === method) {
    const [xt, xtSlr] = calcXtQ0Flux(k, z0, dz, l, w, i, alpha);
    data = calculateDiagramData(xt, z0, xtSlr, z0 + dz, isValid);

    return (
      <Message icon={true} info={true}>
        <Icon name="info circle" color="blue"/>
        <Message.Content>
          <p>
            With a hydraulic gradient i of <strong>{-i.toFixed(3)} m/m</strong>, the calculated distance of the toe of
            interface prior sea level rise is <strong>{Math.abs(data[1].xt).toFixed(1)} m</strong>. The distance of the
            toe of the interface after sea level rise is <strong>{Math.abs(data[2].xt).toFixed(1)} m</strong>.
            Therefore, the toe of the freshwater-saltwater interface will move <strong>{(Math.abs(data[2].xt)
            - Math.abs(data[1].xt)).toFixed(2)}&nbsp;m</strong> inland caused by sea level rise.
          </p>
        </Message.Content>
      </Message>
    );
  }

  return null;
};

export default InfoT09E;
