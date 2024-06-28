import React from 'react';
import {ICalculationProfile} from '../../../../types/CalculationProfile.type';
import {SectionTitle} from '../../../../../../common/components';

interface IProps {
  settings: ICalculationProfile['engine_settings']
  onChange: (settings: ICalculationProfile['engine_settings']) => void
  isReadOnly: boolean
}


const BoundaryPackageSettings = ({settings, onChange, isReadOnly}: IProps) => {
  return (
    <SectionTitle
      as={'h5'} title={'Boundary Packages'}
      style={{marginBottom: 15}}
    />
  );
};

export default BoundaryPackageSettings;
