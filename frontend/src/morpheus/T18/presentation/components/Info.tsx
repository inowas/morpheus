import React from 'react';
import {Grid, Header, Icon, Message} from 'semantic-ui-react';
import {calcAH, calcAN, calcAO, isCtoHigh} from '../../application/useCalculations';
import {getParameterValues} from '../../../common/helpers';
import {IT18} from '../../types/T18.type';

const renderCoWarning = (CoToHigh: boolean) => {
  if (CoToHigh) {
    return (
      <Message icon={true} warning={true}>
        <Icon name="exclamation triangle" color="orange"/>
        <Message.Content>
          <p>
            C<sub>o</sub> is too high and a better pre-treatment is necessary.
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
          C<sub>o</sub> is within acceptable loading.
        </p>
      </Message.Content>
    </Message>
  );
};
const renderCnWarning = (CnToHigh: boolean) => {
  if (CnToHigh) {
    return (
      <Message icon={true} warning={true}>
        <Icon name="exclamation triangle" color="orange"/>
        <Message.Content>
          <p>
            C<sub>n</sub> is too high and a better pre-treatment is necessary.
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
          C<sub>n</sub> is within acceptable loading.
        </p>
      </Message.Content>
    </Message>
  );
};
const renderText = (AH: number, AN: number, AO: number) => {
  const maxA = Math.max(AH, AN, AO);

  if (maxA === AH) {
    return (
      <Message icon={true} info={true}>
        <Icon name="info circle" color="blue"/>
        <Message.Content>
          <p>
            <b>Infiltration rate</b> is defining the estimated field area. <br/>
            The area can be reduced by lowering the flow rate (Q).
          </p>
        </Message.Content>
      </Message>
    );
  }

  if (maxA === AN) {
    return (
      <Message icon={true} info={true}>
        <Icon name="info circle" color="blue"/>
        <Message.Content>
          <p>
            <b>Nitrogen loading</b> is defining the estimated field area. <br/>
            The area can be reduced by lowering the flow rate (Q) or by the pre-treatment of infiltration
            water for the reduction of nitrogen concentration.
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
          <b>BOD loading</b> is defining the estimated field area. <br/>
          The area can be reduced by lowering the flow rate
          (Q) or by the pre-treatment of infiltration water for the reduction of organic matter concentration.
        </p>
      </Message.Content>
    </Message>
  );
};

interface IProps {
  settings: IT18['settings'];
  parameters: IT18['parameters'];
}


const Info = ({parameters, settings}: IProps) => {
  const {LLRN, LLRO, Q, IR, OD, Cn, Co} = getParameterValues(parameters);
  const {AF} = settings;

  const CoToHigh = isCtoHigh(Co, IR, AF, OD, LLRO);
  const AH = calcAH(Q, IR, AF);
  const AN = calcAN(Cn, IR, AF, OD, LLRN, Q);
  const AO = calcAO(Co, IR, AF, OD, LLRO, Q);

  return (
    <Grid>
      <Grid.Row centered={true}>
        <Header as="h4">The required area calculated based on:</Header>
        <p>
          Infiltration rate, A<sub>H</sub> = <strong>{AH.toFixed(2)} m<sup>2</sup></strong><br/>
          BOD loading, A<sub>O</sub> = <strong>{AO.toFixed(2)} m<sup>2</sup></strong><br/>
          Nitrogen loading, A<sub>N</sub> = <strong>{AN.toFixed(2)} m<sup>2</sup></strong>
        </p>
        {renderText(AH, AN, AO)}
      </Grid.Row>
      <Grid.Row centered={true}>
        {renderCoWarning(CoToHigh)}
        {renderCnWarning(false)}
      </Grid.Row>

    </Grid>
  );
};
export default Info;
