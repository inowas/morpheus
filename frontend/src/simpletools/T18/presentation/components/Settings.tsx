import React from 'react';
import {Form, Grid, Header, Radio, Segment} from 'semantic-ui-react';
import {SETTINGS_INFILTRATION_TYPE_BASIN, SETTINGS_INFILTRATION_TYPE_CYLINDER} from '../containers/T18Container';
import {IT18} from '../../types/T18.type';

interface IProps {
  settings: IT18['settings'];
  onChange: (data: IT18['settings']) => void;
}

const Settings = ({settings, onChange}: IProps) => {

  const handleChange = (e: any, {name, value}: any) => {
    onChange({...settings, [name]: value});
  };

  return (
    <Grid padded={true}>
      <Grid.Row centered={true}>
        <Form style={{textAlign: 'left'}}>
          <Header as="h4">The infiltration rate was estimated using:</Header>
          <Segment>
            <Form.Field>
              <Radio
                label="Basin infiltration test"
                value={SETTINGS_INFILTRATION_TYPE_BASIN}
                name="AF"
                checked={settings.AF === SETTINGS_INFILTRATION_TYPE_BASIN}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="Cylinder infiltrometer or air entry permeameter"
                value={SETTINGS_INFILTRATION_TYPE_CYLINDER}
                name="AF"
                checked={settings.AF === SETTINGS_INFILTRATION_TYPE_CYLINDER}
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
