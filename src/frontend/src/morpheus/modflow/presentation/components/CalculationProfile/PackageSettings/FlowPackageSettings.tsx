import {Form, Header} from 'semantic-ui-react';
import React from 'react';
import {ICalculationProfile} from '../../../../types/CalculationProfile.type';
import {DropdownInput} from '../FormFields';
import descriptions from './PackagePropsDescriptions';

import {BcfPackageSettings, LpfPackageSettings} from '../PackageSettings';


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
      <Header as={'h3'} dividing={true}>Flow Packages</Header>
      <Form>
        <Form.Group widths="equal" style={{alignItems: 'stretch'}}>
          <DropdownInput
            value={settings.selected_flow_package}
            isReadOnly={isReadOnly}
            onChange={(value: string) => onChange({...settings, selected_flow_package: value})}
            label={'Select flow Package'}
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
    </>
  );
};

export default FlowPackageSettings;
