import {Form} from 'semantic-ui-react';
import React from 'react';
import {ICalculationProfile} from '../../../../types/CalculationProfile.type';
import {DropdownInput} from '../FormFields';

import {BcfPackageSettings, LpfPackageSettings} from '../PackageSettings';
import {SectionTitle} from 'common/components';
import PackageWrapper from './PackageWrapper';


interface IProps {
  settings: ICalculationProfile['engine_settings']
  onChange: (settings: ICalculationProfile['engine_settings']) => void
  isReadOnly: boolean
}


const FlowPackageSettings = ({settings, onChange, isReadOnly}: IProps) => {

  const flopPackageOptions = settings.available_flow_packages.map((p) => {
    return {key: p, value: p, text: `${p.toUpperCase()} 'Package`};
  });


  return (
    <>
      <SectionTitle
        as={'h5'} title={'Flow Packages'}
        style={{marginBottom: 15}}
      />
      <PackageWrapper>
        <Form
          style={{
            marginBottom: 30,
          }}
        >
          <SectionTitle
            as={'h5'} title={'Select flow Package'}
            style={{marginBottom: 15}}
          />
          <Form.Group
            widths="equal"
          >
            <DropdownInput
              value={settings.selected_flow_package}
              isReadOnly={isReadOnly}
              onChange={(value: string) => onChange({...settings, selected_flow_package: value})}
              options={flopPackageOptions}
            />
          </Form.Group>
        </Form>
        {'lpf' === settings.selected_flow_package && (
          <LpfPackageSettings
            settings={settings.lpf}
            onChange={(value) => onChange({...settings, lpf: value})}
            isReadOnly={isReadOnly}
          />
        )}
        {'bcf' === settings.selected_flow_package && (
          <BcfPackageSettings
            settings={settings.bcf}
            onChange={(value) => onChange({...settings, bcf: value})}
            isReadOnly={isReadOnly}
          />)}
      </PackageWrapper>
    </>
  );
};

export default FlowPackageSettings;
