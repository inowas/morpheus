import {Header} from 'semantic-ui-react';
import React from 'react';
import {IDisPackageSettings} from '../../../../types/CalculationProfile.type';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: IDisPackageSettings
  onChange: (settings: IDisPackageSettings) => void
  isReadOnly: boolean
}


const DisPackageSettings = ({settings, onChange, isReadOnly}: IProps) => (
  <Header as={'h3'} dividing={true}>Dis Package Settings</Header>
);

export default DisPackageSettings;
