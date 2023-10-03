import {Form, Grid, Header, Radio, Segment} from 'semantic-ui-react';
import React from 'react';
import {IT09D} from '../../../types/T09.type';


interface IProps {
  settings: IT09D['settings'];
  onChange: (data: IT09D['settings']) => void;
}

const SettingsT09D = ({settings, onChange}: IProps) => {
  const handleChange = (e: any, {name, value}: any) => {
    onChange({...settings, [name]: value});
  };

  return (
    <Grid padded={true}>
      <Grid.Row centered={true}>
        <Form>
          <Header as="h4">Choose the aquifer type:</Header>
          <Segment style={{textAlign: 'left'}}>
            <Form.Field>
              <Radio
                label="Confined Aquifer"
                value={'confined'}
                name="AqType"
                checked={'confined' === settings.AqType}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="Unconfined Aquifer"
                value={'unconfined'}
                name="AqType"
                checked={'unconfined' === settings.AqType}
                onChange={handleChange}
              />
            </Form.Field>
          </Segment>
        </Form>
      </Grid.Row>
    </Grid>
  );
};

export default SettingsT09D;
