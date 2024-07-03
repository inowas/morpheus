import React from 'react';
import {ISipPackageSettings} from '../../../../types/CalculationProfile.type';
import {SectionTitle} from 'common/components';
import {Divider, Form} from 'semantic-ui-react';
import {CheckBox, NumberInput} from '../FormFields';
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
          <NumberInput
            label={'Maximum iterations per time step (MXITER)'}
            value={settings.mxiter}
            onChange={(value: number) => onChange({...settings, mxiter: value})}
            isReadOnly={isReadOnly}
            description={descriptions.sip.mxiter}
            precision={0}
          />
          <NumberInput
            label={'Number of iteration parameters (NPARM)'}
            value={settings.nparm}
            onChange={(value: number) => onChange({...settings, nparm: value})}
            isReadOnly={isReadOnly}
            description={descriptions.sip.nparm}
            precision={0}
          />
          <NumberInput
            label={'Acceleration parameter (ACCL)'}
            value={settings.accl}
            onChange={(value: number) => onChange({...settings, accl: value})}
            isReadOnly={isReadOnly}
            description={descriptions.sip.accl}
            precision={2}
          />
          <NumberInput
            label={'Head change criterion for convergence (HCLOSE)'}
            value={settings.hclose}
            onChange={(value: number) => onChange({...settings, hclose: value})}
            isReadOnly={isReadOnly}
            description={descriptions.sip.hclose}
            isScientificNotation={true}
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
          <NumberInput
            label={'(WSEED)'}
            value={settings.wseed}
            onChange={(value: number) => onChange({...settings, wseed: value})}
            isReadOnly={isReadOnly}
            description={descriptions.sip.wseed}
            precision={2}
          />
          <NumberInput
            label={'Printout Interval (IPRSIP))'}
            value={settings.iprsip}
            onChange={(value: number) => onChange({...settings, iprsip: value})}
            isReadOnly={isReadOnly}
            description={descriptions.sip.iprsip}
            precision={0}
          />
        </Form.Group>
      </Form>
    </>
  );
};

export default SipPackageSettings;

