import {Form, Header} from 'semantic-ui-react';
import React from 'react';
import {IHobPackageSettings} from '../../../../types/CalculationProfile.type';
import PackageWrapper from './PackageWrapper';
import {FloatInput} from '../FormFields';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: IHobPackageSettings
  onChange: (settings: IHobPackageSettings) => void
  isReadOnly: boolean
}


const HobPackageSettings = ({settings, onChange, isReadOnly}: IProps) => (
  <>
    <Header as={'h3'} dividing={true}>Head Observation Package Settings</Header>
    <PackageWrapper>
      <Form>
        <Form.Group>
          <FloatInput
            value={settings.hobdry}
            onChange={(value: number) => onChange({...settings, hobdry: value})}
            isReadOnly={isReadOnly}
            label={'HOBDRY'}
            description={descriptions.hob.hobdry}
          />
          <FloatInput
            value={settings.tomulth}
            onChange={(value: number) => onChange({...settings, hobdry: value})}
            isReadOnly={isReadOnly}
            label={'TOMULTH'}
            description={descriptions.hob.tomulth}
          />
        </Form.Group>
      </Form>
    </PackageWrapper>
  </>
);

export default HobPackageSettings;
