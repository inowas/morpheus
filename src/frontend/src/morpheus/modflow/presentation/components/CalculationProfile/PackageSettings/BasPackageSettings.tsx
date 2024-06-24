import React from 'react';
import {Form, Header} from 'semantic-ui-react';
import {IBasPackageSettings} from '../../../../types/CalculationProfile.type';
import PackageWrapper from './PackageWrapper';
import {CheckBox} from '../FormFields';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: IBasPackageSettings
  onChange: (settings: IBasPackageSettings) => void
  isReadOnly: boolean
}


const BasPackageSettings = ({settings, onChange, isReadOnly}: IProps) => (
  <>
    <Header as={'h3'} dividing={true}>Bas Package Settings</Header>
    <PackageWrapper>
      <Form>
        <Form.Group>
          <CheckBox
            value={settings.ichflg}
            onChange={(value: boolean) => onChange({...settings, ichflg: value || false})}
            isReadOnly={isReadOnly}
            label={'ICHFLG'}
            description={descriptions.bas.ichflg}
          />
        </Form.Group>
      </Form>
    </PackageWrapper>
  </>
);

export default BasPackageSettings;
