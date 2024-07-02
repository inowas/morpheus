import React from 'react';
import {Form} from 'semantic-ui-react';
import {IBasPackageSettings} from '../../../../types/CalculationProfile.type';
import PackageWrapper from './PackageWrapper';
import {CheckBox, NumberInput, NumberOrNullInput} from '../FormFields';
import descriptions from './PackagePropsDescriptions';
import {SectionTitle} from '../../../../../../common/components';

interface IProps {
  settings: IBasPackageSettings
  onChange: (settings: IBasPackageSettings) => void
  isReadOnly: boolean
}


const BasPackageSettings = ({settings, onChange, isReadOnly}: IProps) => {
  console.log(JSON.stringify(settings, null, 2));
  console.log(Object.keys(settings).length);
  return (
    <>
      <SectionTitle
        as={'h5'}
        title={'Mf Package Settings'}
        style={{marginBottom: 15}}
      />
      <PackageWrapper>
        <Form>
          <Form.Group
            widths={3}
            style={{
              alignItems: 'stretch',
              flexWrap: 'wrap',
              rowGap: 20,
            }}
          >
            <NumberInput
              label={'Head assigned to all no flow cells (HNOFLO)'}
              value={settings.hnoflo}
              onChange={(value: number) => onChange({...settings, hnoflo: value})}
              isReadOnly={true}
              description={descriptions.bas.hnoflo}
              precision={2}
            />
            <NumberOrNullInput
              label={'Budget percent discrepancy (STOPER)'}
              value={settings.stoper}
              onChange={(value: number | null) => onChange({...settings, stoper: value})}
              isReadOnly={true}
              description={descriptions.bas.stoper}
            />
            <CheckBox
              value={settings.ichflg}
              onChange={(value: boolean) => onChange({...settings, ichflg: value || false})}
              isReadOnly={isReadOnly}
              label={'ICHFLG'}
              description={descriptions.bas.ichflg}
            />
          </Form.Group>
        </Form>
      </PackageWrapper>
    </>
  );
};

export default BasPackageSettings;
