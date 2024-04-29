import React from 'react';
import Placeholder from 'common/components/Placeholder';
import {ContentWrapper, Navbar} from 'common/components';
import {ModflowContainer} from '../components';
import {useLocation, useNavigate} from 'common/hooks';
import {useNavbarItems} from '../../../application/application';
import {useParams} from 'react-router-dom';
import useProjectPermissions from '../../application/useProjectPermissions';

interface IProps {
  basePath: string;
}

const AssetsPage = ({}: IProps) => {
  const {projectId} = useParams();
  const navigateTo = useNavigate();
  const location = useLocation();
  const {isReadOnly} = useProjectPermissions(projectId as string);
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
          <Placeholder header={'Assets Page'} message={'Page for Asset Management'}/>
        </ContentWrapper>
      </ModflowContainer>
    </>
  );
};


export default AssetsPage;
