import React from 'react';
import Placeholder from 'common/components/Placeholder';

interface IProps {
  basePath: string;
  section: 'scenarios';
}

const ScenariosPage = ({}: IProps) => (
  <Placeholder header={'Scenarios Page'} message={'Page for Scenario Management'}/>
);


export default ScenariosPage;
