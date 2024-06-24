import {Header} from 'semantic-ui-react';
import React from 'react';
import {ILpfPackageSettings} from '../../../../types/CalculationProfile.type';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: ILpfPackageSettings
  onChange: (settings: ILpfPackageSettings) => void
  isReadOnly: boolean
}


const LpfPackageSettings = ({settings, onChange, isReadOnly}: IProps) => (
  <Header as={'h3'} dividing={true}>Lpf Package Settings</Header>
);

export default LpfPackageSettings;
