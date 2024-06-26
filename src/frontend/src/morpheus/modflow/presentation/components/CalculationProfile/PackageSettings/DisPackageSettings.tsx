import React from 'react';
import {IDisPackageSettings} from '../../../../types/CalculationProfile.type';
import {SectionTitle} from '../../../../../../common/components';

interface IProps {
  settings: IDisPackageSettings
  onChange: (settings: IDisPackageSettings) => void
  isReadOnly: boolean
}


const DisPackageSettings = ({settings, onChange, isReadOnly}: IProps) => (
  <SectionTitle
    as={'h5'} title={'Dis Package Settings'}
    style={{marginBottom: 15}}
  />

);

export default DisPackageSettings;
