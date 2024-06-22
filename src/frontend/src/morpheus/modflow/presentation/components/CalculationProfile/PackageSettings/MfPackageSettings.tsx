import {Form, Header} from 'semantic-ui-react';
import React from 'react';
import PackageWrapper from './PackageWrapper';
import {IMfPackageSettings} from '../../../../types/CalculationProfile.type';
import {CheckBox} from '../FormFields';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: IMfPackageSettings
  onChange: (settings: IMfPackageSettings) => void
  isReadOnly: boolean
}


const MfPackageSettings = ({settings, onChange, isReadOnly}: IProps) => (
  <>
    <Header as={'h3'} dividing={true}>Mf Package Settings</Header>
    <PackageWrapper>
      <Form>
        <Form.Group>
          <CheckBox
            value={settings.verbose}
            onChange={(value: boolean) => onChange({...settings, verbose: value})}
            isReadOnly={isReadOnly}
            label={'Verbose'}
            description={descriptions.mf.verbose}
          />
        </Form.Group>
      </Form>
    </PackageWrapper>
  </>
);

export default MfPackageSettings;
