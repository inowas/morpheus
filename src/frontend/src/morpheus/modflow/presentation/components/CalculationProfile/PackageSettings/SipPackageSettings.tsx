import React from 'react';
import {ISipPackageSettings} from '../../../../types/CalculationProfile.type';
import {SectionTitle} from '../../../../../../common/components';
import {Divider} from 'semantic-ui-react';

interface IProps {
  settings: ISipPackageSettings
  onChange: (settings: ISipPackageSettings) => void
  isReadOnly: boolean
}

const SipPackageSettings = ({settings, onChange, isReadOnly}: IProps) => {

  console.log(JSON.stringify(settings, null, 2));
  console.log(Object.keys(settings).length);

  return (
    <>
      <SectionTitle
        as={'h5'} title={'Sip Package Settings'}
        style={{marginBottom: 15}}
      />
      {/*<Form>*/}
      {/*  <Header as='h4'>Basic</Header>*/}
      {/*  <Form.Group*/}
      {/*    widths={2}*/}
      {/*    style={{*/}
      {/*      alignItems: 'stretch',*/}
      {/*      flexWrap: 'wrap',*/}
      {/*      rowGap: 20,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <IntegerInput*/}
      {/*      label={'Max. no. of outer iterations (ITER_MO)'}*/}
      {/*      value={settings.iter_mo}*/}
      {/*      onChange={(value: number) => onChange({...settings, iter_mo: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.iter_mo}*/}
      {/*    />*/}
      {/*    <IntegerInput*/}
      {/*      label={'Max. no. of inner iterations (ITER_MI)'}*/}
      {/*      value={settings.iter_mi}*/}
      {/*      onChange={(value: number) => onChange({...settings, iter_mi: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.iter_mi}*/}
      {/*    />*/}
      {/*    <FloatInput*/}
      {/*      label={'Residual-based stopping criterion (CLOSE_R)'}*/}
      {/*      value={settings.close_r}*/}
      {/*      onChange={(value: number) => onChange({...settings, close_r: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.close_r}*/}
      {/*    />*/}
      {/*    <FloatInput*/}
      {/*      label={'Head-based stopping criterion (CLOSE_H)'}*/}
      {/*      value={settings.close_h}*/}
      {/*      onChange={(value: number) => onChange({...settings, close_h: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.close_h}*/}
      {/*    />*/}
      {/*    <FloatInput*/}
      {/*      label={'Relaxation parameter (RELAX)'}*/}
      {/*      value={settings.relax}*/}
      {/*      onChange={(value: number) => onChange({...settings, relax: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.relax}*/}
      {/*    />*/}
      {/*    <DropdownInput*/}
      {/*      label={'Fill level of the MIC preconditioner (IFILL)'}*/}
      {/*      value={settings.ifill}*/}
      {/*      onChange={(value: number) => onChange({...settings, ifill: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.ifill}*/}
      {/*      options={[*/}
      {/*        {key: '0', value: 0, text: '(0) Less preconditioning'},*/}
      {/*        {key: '1', value: 1, text: '(1) More preconditioning'},*/}
      {/*      ]}*/}
      {/*    />*/}
      {/*    <IntegerInput*/}
      {/*      label={'Save progress for inner PCG iteration to file (UNIT_PC)'}*/}
      {/*      value={settings.unit_pc}*/}
      {/*      onChange={(value: number) => onChange({...settings, unit_pc: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.unit_pc}*/}
      {/*    />*/}
      {/*    <IntegerInput*/}
      {/*      label={'Save time in PCG solver to file (UNIT_TS)'}*/}
      {/*      value={settings.unit_ts}*/}
      {/*      onChange={(value: number) => onChange({...settings, unit_ts: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.unit_ts}*/}
      {/*    />*/}
      {/*  </Form.Group>*/}
      {/*</Form>*/}
      <Divider/>
      {/*<Form>*/}
      {/*  <Header as='h4'>Non-Linear</Header>*/}
      {/*  <Form.Group*/}
      {/*    widths={2}*/}
      {/*    style={{*/}
      {/*      alignItems: 'stretch',*/}
      {/*      flexWrap: 'wrap',*/}
      {/*      rowGap: 20,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <DropdownInput*/}
      {/*      label={'Damping mode (ADAMP)'}*/}
      {/*      value={settings.adamp}*/}
      {/*      onChange={(value: number) => onChange({...settings, adamp: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.adamp}*/}
      {/*      options={[*/}
      {/*        {key: '0', value: 0, text: '(0) Ordinary'},*/}
      {/*        {key: '1', value: 1, text: '(1) Adaptive'},*/}
      {/*        {key: '2', value: 2, text: '(2) Enhanced'},*/}
      {/*      ]}*/}
      {/*    />*/}
      {/*    <DropdownInput*/}
      {/*      label={'Convergence mode (ACNVG)'}*/}
      {/*      value={settings.acnvg}*/}
      {/*      onChange={(value: number) => onChange({...settings, acnvg: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.acnvg}*/}
      {/*      options={[*/}
      {/*        {key: '0', value: 0, text: '(0) Standard'},*/}
      {/*        {key: '1', value: 1, text: '(1) Adaptive'},*/}
      {/*        {key: '2', value: 2, text: '(2) Enhanced'},*/}
      {/*      ]}*/}
      {/*    />*/}
      {/*    <FloatInput*/}
      {/*      label={'Damping restriction (DAMP)'}*/}
      {/*      value={settings.damp}*/}
      {/*      onChange={(value: number) => onChange({...settings, damp: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.damp}*/}
      {/*    />*/}
      {/*    <FloatInput*/}
      {/*      label={'Minimum relative convergence (CNVG_LB)'}*/}
      {/*      value={settings.cnvg_lb}*/}
      {/*      onChange={(value: number) => onChange({...settings, cnvg_lb: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.cnvg_lb}*/}
      {/*    />*/}
      {/*    <FloatInput*/}
      {/*      label={'Damping lower bound (DAMP_LB)'}*/}
      {/*      value={settings.damp_lb}*/}
      {/*      onChange={(value: number) => onChange({...settings, damp_lb: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.damp_lb}*/}
      {/*    />*/}
      {/*    <IntegerInput*/}
      {/*      label={'Relative convergence increase (MCNVG)'}*/}
      {/*      value={settings.mcnvg}*/}
      {/*      onChange={(value: number) => onChange({...settings, mcnvg: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.mcnvg}*/}
      {/*    />*/}
      {/*    <FloatInput*/}
      {/*      label={'Rate parameter (RATE_D)'}*/}
      {/*      value={settings.rate_d}*/}
      {/*      onChange={(value: number) => onChange({...settings, rate_d: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.rate_d}*/}
      {/*    />*/}
      {/*    <FloatInput*/}
      {/*      label={'Convergence enhancement control (RATE_C)'}*/}
      {/*      value={settings.rate_c}*/}
      {/*      onChange={(value: number) => onChange({...settings, rate_c: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.rate_c}*/}
      {/*    />*/}
      {/*    <FloatInput*/}
      {/*      label={'Maximum head change (CHGLIMIT)'}*/}
      {/*      value={settings.chglimit}*/}
      {/*      onChange={(value: number) => onChange({...settings, chglimit: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.chglimit}*/}
      {/*    />*/}
      {/*    <DropdownInput*/}
      {/*      label={'Progress reporting (IPUNIT)'}*/}
      {/*      value={settings.ipunit}*/}
      {/*      onChange={(value: number) => onChange({...settings, ipunit: value})}*/}
      {/*      isReadOnly={isReadOnly}*/}
      {/*      description={descriptions.pcgn.ipunit}*/}
      {/*      options={[*/}
      {/*        {key: '0', value: 0, text: '(-1) None'},*/}
      {/*        {key: '1', value: 1, text: '(0) Listing file'},*/}
      {/*        {key: '2', value: 2, text: '(1) CSV file'},*/}
      {/*      ]}*/}
      {/*    />*/}
      {/*  </Form.Group>*/}
      {/*</Form>*/}
    </>
  );
};

export default SipPackageSettings;

