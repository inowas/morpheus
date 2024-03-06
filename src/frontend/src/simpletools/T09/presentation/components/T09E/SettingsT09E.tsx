import {Form, Grid, Header, Radio, Segment} from 'semantic-ui-react';

import {IT09E} from '../../../types/T09.type';
import React from 'react';

interface IProps {
  settings: IT09E['settings'];
  onChange: (data: IT09E['settings']) => void;
}

const SettingsT09E = ({settings, onChange}: IProps) => {
  const handleChange = (e: any, {name, value}: any) => {
    onChange({...settings, [name]: value});
  };

  return (
    <Grid padded={true}>
      <Grid.Row centered={true}>
        <Form>
          <Header as="h4">Choose the appropriate boundary condition:</Header>
          <Segment style={{textAlign: 'left'}}>
            <Form.Field>
              <Radio
                label="Constant head"
                value="constHead"
                name="method"
                checked={'constHead' === settings.method}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="Constant flux"
                value="constFlux"
                name="method"
                checked={'constFlux' === settings.method}
                onChange={handleChange}
              />
            </Form.Field>
          </Segment>
        </Form>
      </Grid.Row>
    </Grid>
  );
};

export default SettingsT09E;
