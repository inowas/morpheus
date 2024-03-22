import React from 'react';
import Placeholder from 'common/components/Placeholder';
import {ContentWrapper, Navbar} from '../../../../common/components';
import {ModflowContainer} from '../components';
import {useLocation, useNavigate} from '../../../../common/hooks';
import {useNavbarItems} from '../../../application/application';

interface IProps {
  basePath: string;
}

const AssetsPage = ({}: IProps) => {
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
          <Placeholder header={'Assets Page'} message={'Page for Asset Management'}/>
        </ContentWrapper>
      </ModflowContainer>
    </>

  );
};


export default AssetsPage;
