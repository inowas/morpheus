import {Form, Grid, Header, Icon, Message, Radio, Segment} from 'semantic-ui-react';
import {IT13B, SETTINGS_SELECTED_H0, SETTINGS_SELECTED_HL} from '../../../types/T13.type';

import React from 'react';
import {calculateXwd} from '../../../application/useCalculations';
import {getParameterValues} from '../../../../common/utils';

interface IProps {
  settings: IT13B['settings'];
  parameters: IT13B['parameters'];
  onChange: (data: IT13B['settings']) => void;
}

const SettingsT13C = ({settings, onChange, parameters}: IProps) => {

  const {W, K, L, hL, h0} = getParameterValues(parameters);
  const {selected} = settings;

  const xwd = calculateXwd(L, K, W, hL, h0).toFixed(1);

  const handleChange = (e: any, {name, value}: any) => {
    onChange({...settings, [name]: value});
  };

  return (
    <Grid padded={true}>
      <Grid.Row>
        <Message icon={true} info={true}>
          <Icon name="info circle" color="blue"/>
          <Message.Content>
            <p>
              The regional system is divided into the two subdomains on either side of the water divide.
              The water divide is located at <strong>{xwd} m</strong>.
            </p>
          </Message.Content>
        </Message>
      </Grid.Row>
      <Grid.Row centered={true}>
        <Form>
          <Header as="h4">Select flow domain:</Header>
          <Segment>
            <Form.Group style={{marginBottom: 0}}>
              <Form.Field>
                <Radio
                  label="Left"
                  value={SETTINGS_SELECTED_H0}
                  name="selected"
                  checked={selected === SETTINGS_SELECTED_H0}
                  onChange={handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Right"
                  value={SETTINGS_SELECTED_HL}
                  name="selected"
                  checked={selected === SETTINGS_SELECTED_HL}
                  onChange={handleChange}
                />
              </Form.Field>
            </Form.Group>
          </Segment>
        </Form>
      </Grid.Row>
    </Grid>
  );
};

export default SettingsT13C;
