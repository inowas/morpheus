import React from 'react';
import {IGmgPackageSettings} from '../../../../types/CalculationProfile.type';
import {SectionTitle} from 'common/components';
import {Divider, Form} from 'semantic-ui-react';
import {DropdownInput, NumberInput} from '../FormFields';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: IGmgPackageSettings
  onChange: (settings: IGmgPackageSettings) => void
  isReadOnly: boolean
}

const GmgPackageSettings = ({settings, onChange, isReadOnly}: IProps) => {
  return (
    <>
      <SectionTitle
        as={'h5'} title={'GMG: Geometric Multigrid Solver Package'}
        style={{marginBottom: 15}}
      />
      <Form>
        <Form.Group
          widths={2}
          style={{
            alignItems: 'stretch',
            flexWrap: 'wrap',
            rowGap: 20,
          }}
        >
          <NumberInput
            label={'Inner convergence residual (RCLOSE)'}
            value={settings.rclose}
            onChange={(value: number) => onChange({...settings, rclose: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.rclose}
            isScientificNotation={true}
          />
          <NumberInput
            label={'Maximum inner iterations (IITER)'}
            value={settings.iiter}
            onChange={(value: number) => onChange({...settings, iiter: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.iiter}
            precision={0}
          />
          <NumberInput
            label={'Outer convergence residual (HCLOSE)'}
            value={settings.hclose}
            onChange={(value: number) => onChange({...settings, hclose: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.hclose}
            isScientificNotation={true}
          />
          <NumberInput
            label={'Maximum outer iterations (MXITER)'}
            value={settings.mxiter}
            onChange={(value: number) => onChange({...settings, mxiter: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.mxiter}
            precision={0}
          />
          <NumberInput
            label={'Relocation parameter (RELAX)'}
            value={settings.relax}
            onChange={(value: number) => onChange({...settings, relax: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.relax}
            precision={2}
          />
          <DropdownInput
            label={'Damping option (IADAMP)'}
            value={settings.iadamp}
            onChange={(value: number) => onChange({...settings, iadamp: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.iadamp}
            options={[
              {key: '0', value: 0, text: '(0) Constant'},
              {key: '1', value: 1, text: '(1) Cooley adaptive'},
              {key: '2', value: 2, text: '(2) RRR adaptive'},
            ]}
          />
        </Form.Group>
      </Form>
      <Divider/>
      <Form>
        <Form.Group
          widths={2}
          style={{
            alignItems: 'stretch',
            flexWrap: 'wrap',
            rowGap: 20,
          }}
        >
          <NumberInput
            label={'Output flag (IOUTGMG)'}
            value={settings.ioutgmg}
            onChange={(value: number) => onChange({...settings, ioutgmg: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.ioutgmg}
            precision={0}
          />
          <NumberInput
            label={'Maximum head output (IUNITMHC)'}
            value={settings.iunitmhc}
            onChange={(value: number) => onChange({...settings, iunitmhc: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.iunitmhc}
            precision={0}
          />
          <DropdownInput
            label={'Multi-grid preconditioner smoothing (ISM)'}
            value={settings.ism}
            onChange={(value: number) => onChange({...settings, ism: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.ism}
            options={[
              {key: '0', value: 0, text: '(0) ILU smoothing'},
              {key: '1', value: 1, text: '(1) SGS smoothing'},
            ]}
          />
          <DropdownInput
            label={'Multi-grid preconditioner coarsening (ISC)'}
            value={settings.isc}
            onChange={(value: number) => onChange({...settings, isc: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.isc}
            options={[
              {key: '0', value: 0, text: '(0) Row, Col., Layer'},
              {key: '1', value: 1, text: '(1) Row, Col.'},
              {key: '2', value: 2, text: '(2) Col., Layer'},
              {key: '3', value: 3, text: '(3) Row, Layer'},
              {key: '4', value: 4, text: '(4) None'},
            ]}
          />
          <NumberInput
            label={'Maximum damping (DUP)'}
            value={settings.dup}
            onChange={(value: number) => onChange({...settings, dup: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.dup}
            precision={3}
          />
          <NumberInput
            label={'Minimum damping (DLOW)'}
            value={settings.dlow}
            onChange={(value: number) => onChange({...settings, dlow: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.dlow}
            precision={3}
          />
          <NumberInput
            label={'Damping parameter (DAMP)'}
            value={settings.damp}
            onChange={(value: number) => onChange({...settings, damp: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.damp}
            precision={2}
          />
          <NumberInput
            label={'Minimum damping (CHGLIMIT)'}
            value={settings.chglimit}
            onChange={(value: number) => onChange({...settings, chglimit: value})}
            isReadOnly={isReadOnly}
            description={descriptions.gmg.chglimit}
            precision={2}
          />
        </Form.Group>
      </Form>

    </>
  );
};

export default GmgPackageSettings;

