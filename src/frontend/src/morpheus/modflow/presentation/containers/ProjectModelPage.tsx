import React, {useMemo} from 'react';
import {Navigate, useParams} from 'react-router-dom';
import {ISidebarMenuItem, SidebarMenu} from 'common/components/SidebarMenu';
import {sidebarItems} from '../helpers/sidebarMenu';
import {useLocation, useNavigate} from 'common/hooks';
import {ModflowContainer} from '../components';
import {Navbar} from 'common/components';
import {useNavbarItems} from '../../../application/application';
import {useModel} from '../../application';
import useProjectPermissions from '../../application/useProjectPermissions';

interface IProps {
  basePath: string;
  section: 'model';
}

const ProjectModelPage = ({basePath, section}: IProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {projectId, property} = useParams<{
    projectId?: string;
    property?: string;
    propertyId?: string;
  }>();

  const {isReadOnly} = useProjectPermissions(projectId as string);
  const {navbarItems} = useNavbarItems(projectId as string, isReadOnly);

  const {error, state} = useModel(projectId);

  const sidebarMenuItems: ISidebarMenuItem[] = useMemo(() => sidebarItems.map((item) => ({
    ...item,
    isActive: item.slug == property,
    onClick: () => navigate(`${basePath}/${projectId}/${section}/${item.slug}`),
    isDisabled: !(item.component || item.isTitle),
    // eslint-disable-next-line
  })), [sidebarItems, projectId, property]);

  const redirectToSpatialDiscretization = () => <Navigate to={`${basePath}/${projectId}/model/spatial-discretization`}/>;

  const renderContent = (slug: string | undefined) => {
    const component = sidebarMenuItems.find((item) => item.slug === slug)?.component;
    if (component) {
      return component;
    }
    return <pre style={{
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
        Coming soon
    </pre>;
  };

  if (!projectId) {
    return null;
  }

  if (error) {
    return (<pre>Error: {error.message}</pre>);
  }

  if ('initializing' === state || 'loading' === state) {
    return <pre>Loading...</pre>;
  }

  if ('setup' === state) {
    return (
      <>
        <Navbar
          location={location}
          navbarItems={navbarItems}
          navigateTo={navigate}
        />
        <ModflowContainer>
          <SidebarMenu menuItems={sidebarMenuItems.slice(0, 1)}/>
          {renderContent('setup')}
        </ModflowContainer>
      </>
    );
  }

  if (!property) {
    return redirectToSpatialDiscretization();
  }

  return (
    <>
      <Navbar
        location={location}
        navbarItems={navbarItems}
        navigateTo={navigate}
      />
      <ModflowContainer>
        <SidebarMenu menuItems={sidebarMenuItems}/>
        {renderContent(property)}
      </ModflowContainer>
    </>
  );
};

export default ProjectModelPage;
