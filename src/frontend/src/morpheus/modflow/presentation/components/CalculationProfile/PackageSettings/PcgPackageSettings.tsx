import React from 'react';
import {IPcgPackageSettings} from '../../../../types/CalculationProfile.type';
import {SectionTitle} from '../../../../../../common/components';
import {Divider, Form} from 'semantic-ui-react';
import {DropdownInput, FloatInput, IntegerInput} from '../FormFields';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: IPcgPackageSettings
  onChange: (settings: IPcgPackageSettings) => void
  isReadOnly: boolean
}

const PcgPackageSettings = ({settings, onChange, isReadOnly}: IProps) => {
  return (
    <>
      <SectionTitle
        as={'h5'} title={'PCG: Preconditioned Conjugate-Gradient Package'}
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
          <IntegerInput
            label={'Maximum number of outer iterations (mxiter)'}
            value={settings.mxiter}
            onChange={(value: number) => onChange({...settings, mxiter: value})}
            isReadOnly={isReadOnly}
            description={descriptions.pcg.mxiter}
          />
          <IntegerInput
            label={'Maximum number of inner equations (iter1)'}
            value={settings.iter1}
            onChange={(value: number) => onChange({...settings, iter1: value})}
            isReadOnly={isReadOnly}
            description={descriptions.pcg.iter1}
          />
          <DropdownInput
            label={'Matrix conditioning method (npcond)'}
            value={settings.npcond}
            onChange={(value: number) => onChange({...settings, npcond: value})}
            isReadOnly={isReadOnly}
            description={descriptions.pcg.npcond}
            options={[
              {key: '0', value: 0, text: '(0) Modified Incomplete Cholesky'},
              {key: '1', value: 1, text: '(1) Polynomial'},
            ]}
          />
          <DropdownInput
            label={'Active cells surrounded by dry cells (ihcofadd)'}
            value={settings.ihcofadd}
            onChange={(value: number) => onChange({...settings, ihcofadd: value})}
            isReadOnly={isReadOnly}
            description={descriptions.pcg.ihcofadd}
            options={[
              {key: '0', value: 0, text: '(0) Cell converts to dry'},
              {key: '1', value: 1, text: '(1) Cell converts to dry only if HCOF coefficient is 0'},
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
          <FloatInput
            label={'Head change criterion (hclose)'}
            value={settings.hclose}
            onChange={(value: number) => onChange({...settings, hclose: value})}
            isReadOnly={isReadOnly}
            description={descriptions.pcg.hclose}
          />
          <FloatInput
            label={'Residual criterion (rclose)'}
            value={settings.rclose}
            onChange={(value: number) => onChange({...settings, rclose: value})}
            isReadOnly={isReadOnly}
            description={descriptions.pcg.rclose}
          />
          <FloatInput
            label={'Relaxation parameter (relax)'}
            value={settings.relax}
            onChange={(value: number) => onChange({...settings, relax: value})}
            isReadOnly={isReadOnly}
            description={descriptions.pcg.relax}
          />
          <IntegerInput
            label={'Eigenvalue upper bound (nbpol)'}
            value={settings.nbpol}
            onChange={(value: number) => onChange({...settings, nbpol: value})}
            isReadOnly={isReadOnly}
            description={descriptions.pcg.nbpol}
          />
          <IntegerInput
            label={'Solver printout interval (iprpcg)'}
            value={settings.iprpcg}
            onChange={(value: number) => onChange({...settings, iprpcg: value})}
            isReadOnly={isReadOnly}
            description={descriptions.pcg.iprpcg}
          />
          <DropdownInput
            label={'Print options (mutpcg)'}
            value={settings.mutpcg}
            onChange={(value: number) => onChange({...settings, mutpcg: value})}
            isReadOnly={isReadOnly}
            description={descriptions.pcg.mutpcg}
            options={[
              {key: '0', value: 0, text: '(0) Tables of maximum head change and residual each interation'},
              {key: '1', value: 1, text: '(1) Only total number of iterations'},
              {key: '2', value: 2, text: '(2) No printing'},
              {key: '3', value: 3, text: '(3) Printing only if convergence fails'},
            ]}
          />
          <FloatInput
            label={'Steady-state damping factor (damp)'}
            value={settings.damp}
            onChange={(value: number) => onChange({...settings, damp: value})}
            isReadOnly={isReadOnly}
            description={descriptions.pcg.damp}
          />
          <FloatInput
            label={'Transient damping factor (dampt)'}
            value={settings.dampt}
            onChange={(value: number) => onChange({...settings, dampt: value})}
            isReadOnly={isReadOnly}
            description={descriptions.pcg.dampt}
          />
        </Form.Group>
      </Form>
    </>
  );
};

export default PcgPackageSettings;

