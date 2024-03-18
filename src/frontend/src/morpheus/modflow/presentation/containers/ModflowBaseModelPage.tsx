import React, {useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {ISidebarMenuItem, SidebarMenu} from 'common/components/SidebarMenu';
import {sidebarItems} from '../helpers/sidebarMenu';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useNavigate} from 'common/hooks';
import {ModflowContainer} from '../components';

interface IProps {
  basePath: string;
  section: 'model';
}

const ModflowBaseModelPage = ({basePath, section}: IProps) => {

  const {projectId, property = 'spatial-discretization'} = useParams<{
    projectId?: string;
    property?: string;
    propertyId?: string;
  }>();

  const navigate = useNavigate();

  const sidebarMenuItems: ISidebarMenuItem[] = useMemo(() => {
    return sidebarItems.map((item) => {
      return {
        icon: <FontAwesomeIcon icon={item.icon}/>,
        name: item.description,
        isActive: property === item.slug,
        isDisabled: item.disabled,
        isTitle: !!item.title,
        slug: item.slug,
        onClick: () => navigate(`${basePath}/${projectId}/${section}/${item.slug}`),
        component: item.component,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarItems, projectId, property]);

  const renderContent = (slug: string) => {
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

  return (
    <ModflowContainer headerHeight={140}>
      <SidebarMenu menuItems={sidebarMenuItems}/>
      {renderContent(property)}
    </ModflowContainer>
  );
};

export default ModflowBaseModelPage;
