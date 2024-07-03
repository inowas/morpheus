import React from 'react';
import {IOcPackageSettings} from '../../../../types/CalculationProfile.type';
import {SectionTitle} from 'common/components';

interface IProps {
  settings: IOcPackageSettings
  onChange: (settings: IOcPackageSettings) => void
  isReadOnly: boolean
}


const OcPackageSettings = ({settings, onChange, isReadOnly}: IProps) => (
  <SectionTitle
    as={'h5'} title={'Oc Package Settings'}
    style={{marginBottom: 15}}
  />
);

export default OcPackageSettings;
