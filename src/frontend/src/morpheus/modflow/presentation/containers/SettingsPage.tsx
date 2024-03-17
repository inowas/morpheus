import React from 'react';
import Placeholder from 'common/components/Placeholder';

interface IProps {
  basePath: string;
}

const SettingsPage = ({}: IProps) => (
  <Placeholder header={'Settings Page'} message={'Page for Settings'}/>
);


export default SettingsPage;
