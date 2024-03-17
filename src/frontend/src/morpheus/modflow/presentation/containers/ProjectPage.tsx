import React from 'react';
import Placeholder from 'common/components/Placeholder';

interface IProps {
  basePath: string;
}

const ProjectPage = ({}: IProps) => (
  <Placeholder header={'Project Overview'} message={'Shows general information about a project. Metadata could algo go here.'}/>
);


export default ProjectPage;
