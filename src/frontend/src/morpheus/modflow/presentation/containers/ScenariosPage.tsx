import React from 'react';
import Placeholder from 'common/components/Placeholder';
import {ContentWrapper, Navbar} from 'common/components';
import {ModflowContainer} from '../components';
import {useLocation, useNavigate} from 'common/hooks';
import {useNavbarItems} from '../../../application/application';
import {useParams} from 'react-router-dom';
import useProjectPrivileges from '../../application/useProjectPrivileges';

interface IProps {
  basePath: string;
  section: 'scenarios';
}

const ScenariosPage = ({}: IProps) => {
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
          <Placeholder header={'Scenarios Page'} message={'Page for Scenario Management'}/>
        </ContentWrapper>
      </ModflowContainer>
    </>
  );
};


export default ScenariosPage;
