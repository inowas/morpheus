import React, {useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {ISidebarMenuItem, SidebarMenu} from 'common/components/SidebarMenu';
import {sidebarItems} from '../helpers/sidebarMenu';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useNavigate} from 'common/hooks';
import {ModflowContainer} from '../components';

interface IProps {
  basePath: string;
}

const ModflowBaseModelPage = ({basePath}: IProps) => {

  const {id, property = 'spatial-discretization'} = useParams<{
    id: string;
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
        onClick: () => navigate(`${basePath}/${id}/${item.slug}`),
        component: item.component,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarItems, id, property, basePath]);

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
