import React from 'react';
import Placeholder from 'common/components/Placeholder';
import {ContentWrapper, Navbar} from 'common/components';
import {ModflowContainer} from '../components';
import {useLocation, useNavigate} from 'common/hooks';
import {useNavbarItems} from '../../../application/application';
import {useParams} from 'react-router-dom';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import ProjectTitleContainer from './ProjectTitleContainer';

interface IProps {
  basePath: string;
}

const SettingsPage = ({}: IProps) => {

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
      >
        <ProjectTitleContainer/>
      </Navbar>
      <ModflowContainer>
        <ContentWrapper>
          <Placeholder header={'Settings Page'} message={'Page for Settings'}/>
        </ContentWrapper>
      </ModflowContainer>
    </>

  );
};


export default SettingsPage;
