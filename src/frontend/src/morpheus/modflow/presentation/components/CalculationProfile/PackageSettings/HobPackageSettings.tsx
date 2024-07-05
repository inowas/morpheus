import {Form} from 'semantic-ui-react';
import React from 'react';
import {IHobPackageSettings} from '../../../../types/CalculationProfile.type';
import PackageWrapper from './PackageWrapper';
import {NumberInput} from '../FormFields';
import descriptions from './PackagePropsDescriptions';
import {SectionTitle} from 'common/components';

interface IProps {
  settings: IHobPackageSettings
  onChange: (settings: IHobPackageSettings) => void
  isReadOnly: boolean
}


const HobPackageSettings = ({settings, onChange, isReadOnly}: IProps) => (
  <>
    <SectionTitle
      as={'h5'} title={'Head Observation Package Settings'}
      style={{marginBottom: 15}}
    />
    <PackageWrapper>
      <Form>
        <Form.Group widths={2}>
          <NumberInput
            value={settings.hobdry}
            onChange={(value: number) => onChange({...settings, hobdry: value})}
            isReadOnly={isReadOnly}
            label={'HOBDRY'}
            description={descriptions.hob.hobdry}
            precision={0}
          />
          <NumberInput
            value={settings.tomulth}
            onChange={(value: number) => onChange({...settings, hobdry: value})}
            isReadOnly={isReadOnly}
            label={'TOMULTH'}
            description={descriptions.hob.tomulth}
            precision={2}
          />
        </Form.Group>
      </Form>
    </PackageWrapper>
  </>
);

export default HobPackageSettings;
