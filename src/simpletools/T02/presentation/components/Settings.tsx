import React from 'react';
import {Form, Grid, Header, Radio, Segment} from 'semantic-ui-react';
import {IT02} from '../../types/T02.type';


interface IProps {
  settings: IT02['settings'],
  onChange: (data: IT02['settings']) => void
}

const Settings = (props: IProps) => {

  const handleChange = (e: any, {name, value}: any) => {
    props.onChange({[name]: value} as IT02['settings']);
  };

  return (
    <Grid padded={true}>
      <Grid.Row centered={true}>
        <Form>
          <Header as={'h4'}>Select the axis:</Header>
          <Segment>
            <Form.Group style={{marginBottom: 0}}>
              <Form.Field>
                <Radio
                  label="x-axis"
                  value="x"
                  name="variable"
                  checked={'x' === props.settings.variable}
                  onChange={handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="y-axis"
                  value="y"
                  name="variable"
                  checked={'y' === props.settings.variable}
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

export default Settings;
