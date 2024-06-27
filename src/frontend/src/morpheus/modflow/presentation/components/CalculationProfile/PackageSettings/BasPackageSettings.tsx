import React from 'react';
import {Form} from 'semantic-ui-react';
import {IBasPackageSettings} from '../../../../types/CalculationProfile.type';
import PackageWrapper from './PackageWrapper';
import {CheckBox} from '../FormFields';
import descriptions from './PackagePropsDescriptions';
import {SectionTitle} from '../../../../../../common/components';

interface IProps {
  settings: IBasPackageSettings
  onChange: (settings: IBasPackageSettings) => void
  isReadOnly: boolean
}


const BasPackageSettings = ({settings, onChange, isReadOnly}: IProps) => (
  <>
    <SectionTitle
      as={'h5'}
      title={'Mf Package Settings'}
      style={{marginBottom: 15}}
    />
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
