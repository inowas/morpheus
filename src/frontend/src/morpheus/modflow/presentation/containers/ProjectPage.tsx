import React from 'react';
import Placeholder from 'common/components/Placeholder';
import {ContentWrapper, Navbar} from '../../../../common/components';
import {useLocation, useNavigate} from '../../../../common/hooks';
import {ModflowContainer} from '../components';
import {useNavbarItems} from '../../../application/application';

interface IProps {
  basePath: string;
}

const ProjectPage = ({}: IProps) => {

  const navigateTo = useNavigate();
  const location = useLocation();
  const {navbarItems, showSearchBar, showButton} = useNavbarItems();


  return (
    <>
      <Navbar
        location={location}
        navbarItems={navbarItems}
        navigateTo={navigateTo}
        showSearchWrapper={showSearchBar}
        showCreateButton={showButton}
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
