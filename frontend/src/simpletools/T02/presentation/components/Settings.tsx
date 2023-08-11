import React, {SyntheticEvent} from 'react';
import {Form, Grid, Header, Radio, Segment} from 'semantic-ui-react';
import {IT02} from '../../types/T02.type';

type ISettings = IT02['settings'];

interface IProps {
  settings: ISettings,
  onChange: (data: ISettings) => void
}

const Settings = (props: IProps) => {

  const handleChange = (event: SyntheticEvent, {name, value}: any) => {
    props.onChange({[name]: value} as ISettings);
  };

  return (
    <Grid
      padded={true}
      data-testid={'settings-container'}
    >
      <Grid.Row centered={true}>
        <Form>
          <Header as={'h4'}>Select the axis:</Header>
          <Segment>
            <Form.Group style={{marginBottom: 0}}>
              <Form.Field>
                <Radio
                  data-testid={'x-axis-radio'}
                  label="x-axis"
                  value="x"
                  name="variable"
                  checked={'x' === props.settings.variable}
                  onChange={handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  data-testid={'y-axis-radio'}
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
