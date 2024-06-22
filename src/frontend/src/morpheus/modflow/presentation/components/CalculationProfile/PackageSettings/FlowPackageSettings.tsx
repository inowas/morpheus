import {Header} from 'semantic-ui-react';
import React from 'react';
import {ICalculationProfile} from '../../../../types/CalculationProfile.type';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: ICalculationProfile['engine_settings']
  onChange: (settings: ICalculationProfile['engine_settings']) => void
  isReadOnly: boolean
}


const FlowPackageSettings = ({settings, onChange, isReadOnly}: IProps) => {
  return (
    <Header as={'h3'} dividing={true}>Flow Packages</Header>

  );
};

export default FlowPackageSettings;
