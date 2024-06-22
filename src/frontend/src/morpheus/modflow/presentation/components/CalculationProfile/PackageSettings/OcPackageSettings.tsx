import {Header} from 'semantic-ui-react';
import React from 'react';
import {IOcPackageSettings} from '../../../../types/CalculationProfile.type';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: IOcPackageSettings
  onChange: (settings: IOcPackageSettings) => void
  isReadOnly: boolean
}


const OcPackageSettings = ({settings, onChange, isReadOnly}: IProps) => (
  <Header as={'h3'} dividing={true}>Oc Package Settings</Header>
);

export default OcPackageSettings;
