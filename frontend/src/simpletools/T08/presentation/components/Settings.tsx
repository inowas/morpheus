import React from 'react';
import {Form, Grid, Header, Radio, Segment} from 'semantic-ui-react';

import {SETTINGS_CASE_FIXED_TIME, SETTINGS_CASE_VARIABLE_TIME, SETTINGS_INFILTRATION_CONTINUOUS, SETTINGS_INFILTRATION_ONE_TIME} from '../containers/T08Container';
import {IT08} from '../../types/T08.type';

interface IProps {
  settings: IT08['settings'];
  onChange: (data: IT08['settings']) => void;
}

const Settings = ({settings, onChange}: IProps) => {
  const handleChange = (e: any, {name, value}: any) => {
    onChange({...settings, [name]: value});
  };

  return (
    <Grid
      padded={true}
      data-testid={'settings-container'}
    >
      <Grid.Row centered={true}>
        <Form>
          <Header as="h4">Select variable</Header>
          <Segment>
            <Form.Field>
              <Radio
                data-testid={'x-axis-radio'}
                label="Variable time (T), Fixed length (x)"
                value={SETTINGS_CASE_VARIABLE_TIME}
                name="case"
                checked={settings.case === SETTINGS_CASE_VARIABLE_TIME} // 2
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                data-testid={'y-axis-radio'}
                label="Fixed time (T), Variable length (x)"
                value={SETTINGS_CASE_FIXED_TIME}
                name="case"
                checked={settings.case === SETTINGS_CASE_FIXED_TIME} // 1
                onChange={handleChange}
              />
            </Form.Field>
          </Segment>
          <Header as="h4">Select the type of infiltration</Header>
          <Segment>
            <Form.Field>
              <Radio
                data-testid="continuous-radio"
                label="Continuous infiltration"
                value={SETTINGS_INFILTRATION_CONTINUOUS}
                name="infiltration"
                checked={settings.infiltration === SETTINGS_INFILTRATION_CONTINUOUS}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                data-testid="one-time-radio"
                label="One-time infiltration"
                value={SETTINGS_INFILTRATION_ONE_TIME}
                name="infiltration"
                checked={settings.infiltration === SETTINGS_INFILTRATION_ONE_TIME}
                onChange={handleChange}
              />
            </Form.Field>
          </Segment>
        </Form>
      </Grid.Row>
    </Grid>
  );
};

export default Settings;
