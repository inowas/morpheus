import {Header} from 'semantic-ui-react';
import React from 'react';
import {IBcfPackageSettings} from '../../../../types/CalculationProfile.type';
import descriptions from './PackagePropsDescriptions';

interface IProps {
  settings: IBcfPackageSettings;
  onChange: (settings: IBcfPackageSettings) => void;
  isReadOnly: boolean;
}


const BcfPackageSettings = ({settings, onChange, isReadOnly}: IProps) => (
  <Header as={'h3'} dividing={true}>Bcf Package Settings</Header>
);

export default BcfPackageSettings;
