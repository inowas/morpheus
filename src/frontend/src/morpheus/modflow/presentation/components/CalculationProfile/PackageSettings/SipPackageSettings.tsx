import React from 'react';
import {ISipPackageSettings} from '../../../../types/CalculationProfile.type';
import {SectionTitle} from '../../../../../../common/components';
import {Divider, Form} from 'semantic-ui-react';
import {CheckBox, FloatInput, IntegerInput} from '../FormFields';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: ISipPackageSettings
  onChange: (settings: ISipPackageSettings) => void
  isReadOnly: boolean
}

const SipPackageSettings = ({settings, onChange, isReadOnly}: IProps) => {

  return (
    <>
      <SectionTitle
        as={'h5'} title={'SIP: Strongly Implicit Procedure Package'}
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
            label={'Maximum iterations per time step (MXITER)'}
            value={settings.mxiter}
            onChange={(value: number) => onChange({...settings, mxiter: value})}
            isReadOnly={isReadOnly}
            description={descriptions.sip.mxiter}
          />
          <IntegerInput
            label={'Number of iteration parameters (NPARM)'}
            value={settings.nparm}
            onChange={(value: number) => onChange({...settings, nparm: value})}
            isReadOnly={isReadOnly}
            description={descriptions.sip.nparm}
          />
          <FloatInput
            label={'Acceleration parameter (ACCL)'}
            value={settings.accl}
            onChange={(value: number | null) => null !== value && onChange({...settings, accl: value})}
            isReadOnly={isReadOnly}
            description={descriptions.sip.accl}
          />
          <FloatInput
            label={'Head change criterion for convergence (HCLOSE)'}
            value={settings.hclose}
            onChange={(value: number | null) => null !== value && onChange({...settings, hclose: value})}
            isReadOnly={isReadOnly}
            description={descriptions.sip.hclose}
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
          <CheckBox
            label={'Calculate seed at start (IPCALC)'}
            value={settings.ipcalc ? true : false}
            onChange={(value: boolean) => onChange({...settings, ipcalc: value ? 1 : 0})}
            isReadOnly={isReadOnly}
            description={descriptions.sip.ipcalc}
          />
          <FloatInput
            label={'(WSEED)'}
            value={settings.wseed}
            onChange={(value: number | null) => null !== value && onChange({...settings, wseed: value})}
            isReadOnly={true}
            description={descriptions.sip.wseed}
          />
          <IntegerInput
            label={'Printout Interval (IPRSIP))'}
            value={settings.iprsip}
            onChange={(value: number) => onChange({...settings, iprsip: value})}
            isReadOnly={isReadOnly}
            description={descriptions.sip.iprsip}
          />
        </Form.Group>
      </Form>
    </>
  );
};

export default SipPackageSettings;

