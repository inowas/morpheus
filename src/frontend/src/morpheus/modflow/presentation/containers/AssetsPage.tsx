import React from 'react';
import Placeholder from 'common/components/Placeholder';

interface IProps {
  basePath: string;
}

const AssetsPage = ({}: IProps) => (
  <Placeholder header={'Assets Page'} message={'Page for Asset Management'}/>
);


export default AssetsPage;
