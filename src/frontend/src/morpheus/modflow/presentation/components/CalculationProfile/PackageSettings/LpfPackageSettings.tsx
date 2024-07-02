import React from 'react';
import {ILpfPackageSettings} from '../../../../types/CalculationProfile.type';
import {Form} from 'semantic-ui-react';
import {SectionTitle} from '../../../../../../common/components';
import {CheckBox, DropdownInput, NumberInput} from '../FormFields';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: ILpfPackageSettings
  onChange: (settings: ILpfPackageSettings) => void
  isReadOnly: boolean
}

const LpfPackageSettings = ({settings, onChange, isReadOnly}: IProps) => {

  return (
    <>
      <SectionTitle
        as={'h5'} title={'Lpf Package Settings'}
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
          <CheckBox
            label={'Save cell-by-cell budget data (IPAKCB)'}
            value={settings.ipakcb ? true : false}
            onChange={(value: boolean) => onChange({...settings, ipakcb: value ? 1 : 0})}
            isReadOnly={isReadOnly}
            description={descriptions.lpf.ipakcb}
          />
          <CheckBox
            label={'Wetting capability (IWDFLG)'}
            value={settings.iwdflg ? true : false}
            onChange={(value: boolean) => onChange({...settings, iwdflg: value ? 1 : 0})}
            isReadOnly={isReadOnly}
            description={descriptions.lpf.iwdflg}
          />
          <DropdownInput
            label={'Rewetting equation (IHDWET)'}
            value={settings.ihdwet}
            onChange={(value: number) => onChange({...settings, ihdwet: value})}
            isReadOnly={isReadOnly}
            description={descriptions.lpf.ihdwet}
            options={[
              {key: '0', value: 0, text: '(0) h = BOT + WETFCT(hn - BOT) (eq 33A)'},
              {key: '1', value: 1, text: '(1) h = BOT + WETFCT(THRESH), (eq 33B)'},
            ]}
          />
          <NumberInput
            label={'Wetting factor (WETFCT)'}
            value={settings.wetfct}
            onChange={(value: number) => onChange({...settings, wetfct: value})}
            isReadOnly={isReadOnly}
            description={descriptions.lpf.wetfct}
            precision={2}
          />
          <NumberInput
            label={'Wetting interval (IWETIT)'}
            value={settings.iwetit}
            onChange={(value: number) => onChange({...settings, iwetit: value})}
            isReadOnly={isReadOnly}
            description={descriptions.lpf.iwetit}
            precision={0}
          />
          <NumberInput
            label={'Wetting threshold and flag (WETDRY)'}
            value={settings.wetdry}
            onChange={(value: number) => onChange({...settings, wetdry: value})}
            isReadOnly={true}
            description={descriptions.lpf.wetdry}
            precision={3}
          />
          <NumberInput
            label={'Head assigned to dry cells (HDRY)'}
            value={settings.hdry}
            isReadOnly={true}
            onChange={(value: number) => onChange({...settings, hdry: value})}
            description={descriptions.lpf.hdry}
            isScientificNotation={true}
          />
          <CheckBox
            label={'Storage coefficient (STORAGECOEFFICIENT)'}
            value={settings.storagecoefficient}
            onChange={(value: boolean) => onChange({...settings, storagecoefficient: value})}
            isReadOnly={isReadOnly}
            description={descriptions.lpf.storagecoefficient}
          />
          <CheckBox
            label={'Vertical conductance correction (NOCVCORRECTION)'}
            value={settings.nocvcorrection}
            onChange={(value: boolean) => onChange({...settings, nocvcorrection: value})}
            isReadOnly={isReadOnly}
            description={descriptions.lpf.nocvcorrection}
          />
          <CheckBox
            label={'Vertical conductance (CONSTANTCV)'}
            value={settings.constantcv}
            onChange={(value: boolean) => onChange({...settings, constantcv: value})}
            isReadOnly={isReadOnly}
            description={descriptions.lpf.constantcv}
          />
          <CheckBox
            label={'Vertical flow correction (NOVFC)'}
            value={settings.novfc}
            onChange={(value: boolean) => onChange({...settings, novfc: value})}
            isReadOnly={isReadOnly}
            description={descriptions.lpf.novfc}
          />
          <CheckBox
            label={'Computed cell thickness (THICKSTRT)'}
            value={settings.thickstrt}
            onChange={(value: boolean) => onChange({...settings, thickstrt: value})}
            isReadOnly={isReadOnly}
            description={descriptions.lpf.thickstrt}
          />
        </Form.Group>
      </Form>
    </>
  );
};

export default LpfPackageSettings;
