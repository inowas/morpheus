import React from 'react';
import {ICalculationProfile} from '../../../../types/CalculationProfile.type';
import {SectionTitle} from '../../../../../../common/components';
import PackageWrapper from './PackageWrapper';
import {DropdownInput} from '../FormFields';
import {Form} from 'semantic-ui-react';
import {De4PackageSettings, GmgPackageSettings, PcgnPackageSettings, PcgPackageSettings} from './index';
import SipPackageSettings from './SipPackageSettings';

interface IProps {
  settings: ICalculationProfile['engine_settings']
  onChange: (settings: ICalculationProfile['engine_settings']) => void
  isReadOnly: boolean
}


const SolverPackageSettings = ({settings, onChange, isReadOnly}: IProps) => {
  console.log(settings);

  const flopPackageOptions = settings.available_solver_packages.map((p) => {
    return {key: p, value: p, text: `${p.toUpperCase()} 'Package`};
  });

  return (
    <>
      <SectionTitle
        as={'h5'} title={'Solver Packages'}
        style={{marginBottom: 15}}
      />
      <PackageWrapper>
        <Form
          style={{
            marginBottom: 30,
          }}
        >
          <SectionTitle
            as={'h5'} title={'Select solver Package'}
            style={{marginBottom: 15}}
          />
          <Form.Group
            widths="equal"
          >
            <DropdownInput
              value={settings.selected_solver_package}
              isReadOnly={isReadOnly}
              onChange={(value: string) => onChange({...settings, selected_solver_package: value})}
              options={flopPackageOptions}
            />
          </Form.Group>
        </Form>
        {'de4' === settings.selected_solver_package && (
          <De4PackageSettings
            settings={settings.de4}
            onChange={(value) => onChange({...settings, de4: value})}
            isReadOnly={isReadOnly}
          />
        )}
        {'gmg' === settings.selected_solver_package && (
          <GmgPackageSettings
            settings={settings.gmg}
            onChange={(value) => onChange({...settings, gmg: value})}
            isReadOnly={isReadOnly}
          />
        )}
        {'pcg' === settings.selected_solver_package && (
          <PcgPackageSettings
            settings={settings.pcg}
            onChange={(value) => onChange({...settings, pcg: value})}
            isReadOnly={isReadOnly}
          />
        )}
        {'pcgn' === settings.selected_solver_package && (
          <PcgnPackageSettings
            settings={settings.pcgn}
            onChange={(value) => onChange({...settings, pcgn: value})}
            isReadOnly={isReadOnly}
          />
        )}
        {'sip' === settings.selected_solver_package && (
          <SipPackageSettings
            settings={settings.sip}
            onChange={(value) => onChange({...settings, sip: value})}
            isReadOnly={isReadOnly}
          />
        )}
      </PackageWrapper>
    </>
  );
};

export default SolverPackageSettings;
