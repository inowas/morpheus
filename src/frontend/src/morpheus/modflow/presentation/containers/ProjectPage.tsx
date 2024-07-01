import React from 'react';
import Placeholder from 'common/components/Placeholder';
import {ContentWrapper, Navbar} from 'common/components';
import {useLocation, useNavigate} from 'common/hooks';
import {ModflowContainer} from '../components';
import {useNavbarItems} from '../../../application/application';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import {useParams} from 'react-router-dom';

interface IProps {
  basePath: string;
}

const ProjectPage = ({}: IProps) => {

  const navigateTo = useNavigate();
  const location = useLocation();
  const {projectId} = useParams();
  const {isReadOnly} = useProjectPrivileges(projectId as string);
  const {navbarItems} = useNavbarItems(projectId as string, isReadOnly);

  return (
    <>
      <Navbar
        location={location}
        navbarItems={navbarItems}
        navigateTo={navigateTo}
      />
      <ModflowContainer>
        <ContentWrapper>
          <Placeholder header={'Project Overview'} message={'Shows general information about a project. Metadata could algo go here.'}/>
        </ContentWrapper>
      </ModflowContainer>
    </>
  );
};


export default ProjectPage;
