import React from 'react';
import {IBcfPackageSettings} from '../../../../types/CalculationProfile.type';
import {SectionTitle} from '../../../../../../common/components';
import {CheckBox, DropdownInput, FloatInput, IntegerInput} from '../FormFields';
import descriptions from './PackagePropsDescriptions';
import {Form} from 'semantic-ui-react';

interface IProps {
  settings: IBcfPackageSettings;
  onChange: (settings: IBcfPackageSettings) => void;
  isReadOnly: boolean;
}


const BcfPackageSettings = ({settings, onChange, isReadOnly}: IProps) => {

  return (
    <>
      <SectionTitle
        as={'h5'} title={'Bcf Package Settings'}
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
            description={descriptions.bcf.ipakcb}
          />
          <CheckBox
            label={'Wetting capability (IWDFLG)'}
            value={settings.iwdflg ? true : false}
            onChange={(value: boolean) => onChange({...settings, iwdflg: value ? 1 : 0})}
            isReadOnly={isReadOnly}
            description={descriptions.bcf.iwdflg}
          />
          <DropdownInput
            label={'Rewetting equation (IHDWET)'}
            value={settings.ihdwet}
            onChange={(value: number) => onChange({...settings, ihdwet: value})}
            isReadOnly={isReadOnly}
            description={descriptions.bcf.ihdwet}
            options={[
              {key: '0', value: 0, text: '(0) h = BOT + WETFCT(hn - BOT) (eq 33A)'},
              {key: '1', value: 1, text: '(1) h = BOT + WETFCT(THRESH), (eq 33B)'},
            ]}
          />
          <FloatInput
            label={'Wetting factor (WETFCT)'}
            value={settings.wetfct}
            onChange={(value: number) => onChange({...settings, wetfct: value})}
            isReadOnly={isReadOnly}
            description={descriptions.bcf.wetfct}
          />
          <IntegerInput
            label={'Wetting interval (IWETIT)'}
            value={settings.iwetit}
            onChange={(value: number) => onChange({...settings, iwetit: value})}
            isReadOnly={isReadOnly}
            description={descriptions.bcf.iwetit}
          />
          <FloatInput
            label={'Wetting threshold and flag (WETDRY)'}
            value={settings.wetdry}
            onChange={(value: number) => onChange({...settings, wetdry: value})}
            isReadOnly={true}
            description={descriptions.bcf.wetdry}
          />
          {/* TODO - update hdry for scientific number using FloatInput and toExponential  */}
          <IntegerInput
            label={'Head assigned to dry cells (HDRY)'}
            value={settings.hdry}
            isReadOnly={true}
            onChange={(value: number) => onChange({...settings, hdry: value})}
            description={descriptions.bcf.hdry}
          />
        </Form.Group>
      </Form>
    </>
  );
};


// ipakcb:0
// iwdflg:0
// ihdwet:0
// wetfct:0.1
// iwetit:1
// wetdry:-0.01
// hdry: -1e+30

export default BcfPackageSettings;
