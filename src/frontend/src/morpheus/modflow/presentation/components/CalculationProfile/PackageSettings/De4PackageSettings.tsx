import React from 'react';
import {IDe4PackageSettings} from '../../../../types/CalculationProfile.type';
import {SectionTitle} from 'common/components';
import {Divider, Form} from 'semantic-ui-react';
import {NumberInput} from '../FormFields';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: IDe4PackageSettings
  onChange: (settings: IDe4PackageSettings) => void
  isReadOnly: boolean
}

const De4PackageSettings = ({settings, onChange, isReadOnly}: IProps) => {
  return (
    <>
      <SectionTitle
        as={'h5'} title={'DE4: Direct Solver Package'}
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
            label={'Maximum number of iterations (ITMX)'}
            value={settings.itmx}
            onChange={(value: number) => onChange({...settings, itmx: value})}
            isReadOnly={isReadOnly}
            description={descriptions.de4.itmx}
            precision={0}
          />
          <NumberInput
            label={'Maximum number of upper equations (MXUP)'}
            value={settings.mxup}
            onChange={(value: number) => onChange({...settings, mxup: value})}
            isReadOnly={isReadOnly}
            description={descriptions.de4.mxup}
            precision={0}
          />
          <NumberInput
            label={'Maximum number of lower equations (MXLOW)'}
            value={settings.mxlow}
            onChange={(value: number) => onChange({...settings, mxlow: value})}
            isReadOnly={isReadOnly}
            description={descriptions.de4.mxlow}
            precision={0}
          />
          <NumberInput
            label={'Maximum bandwidth (MXBW)'}
            value={settings.mxbw}
            onChange={(value: number) => onChange({...settings, mxbw: value})}
            isReadOnly={isReadOnly}
            description={descriptions.de4.mxbw}
            precision={0}
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
            label={'Frequency of change (IFREQ)'}
            value={settings.ifreq}
            onChange={(value: number) => onChange({...settings, ifreq: value})}
            isReadOnly={isReadOnly}
            description={descriptions.de4.ifreq}
            precision={0}
          />
          <NumberInput
            label={'Head change multiplier (ACCL)'}
            value={settings.accl}
            onChange={(value: number) => onChange({...settings, accl: value})}
            isReadOnly={isReadOnly}
            description={descriptions.de4.accl}
            precision={0}
          />
          <NumberInput
            label={'Print convergence (MUTD4)'}
            value={settings.mutd4}
            onChange={(value: number) => onChange({...settings, mutd4: value})}
            isReadOnly={isReadOnly}
            description={descriptions.de4.mutd4}
            precision={0}
          />
          <NumberInput
            label={'Head change closure criterion (HCLOSE)'}
            value={settings.hclose}
            onChange={(value: number) => onChange({...settings, hclose: value})}
            isReadOnly={isReadOnly}
            description={descriptions.de4.hclose}
            isScientificNotation={true}
          />
          <NumberInput
            label={'Time step interval for printing (IPRD4)'}
            value={settings.iprd4}
            onChange={(value: number) => onChange({...settings, iprd4: value})}
            isReadOnly={isReadOnly}
            description={descriptions.de4.iprd4}
            precision={0}
          />
        </Form.Group>
      </Form>
    </>
  );
};

export default De4PackageSettings;
