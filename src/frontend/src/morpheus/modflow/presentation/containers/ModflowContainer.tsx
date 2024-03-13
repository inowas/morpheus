import React from 'react';
import {ApplicationContentWrapper, Map} from '../../../../common/components';
import {sidebarItems} from '../helpers/sidebarMenu';
import type {FeatureCollection} from 'geojson';
import {useParams} from 'react-router-dom';
import {ISidebarMenuItem} from '../../../../common/components/SidebarMenu';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useNavigate} from 'common/hooks';


const geoJsonPolygon: FeatureCollection = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [
            [
              13.737521,
              51.05702,
            ],
            [
              13.723092,
              51.048919,
            ],
            [
              13.736491,
              51.037358,
            ],
            [
              13.751779,
              51.04773,
            ],
            [
              13.737521,
              51.05702,
            ],
          ],
        ],
      },
    },
  ],
};

interface IProps {
  basePath: string;
}

const ModflowContainer = ({basePath}: IProps) => {

  const {id = '123', property = 'spatial-discretization'} = useParams<{
    id: string;
    property: string;
    propertyId?: string;
  }>();

  const navigate = useNavigate();

  const sidebarMenuItems: ISidebarMenuItem[] = sidebarItems.map((item) => {
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

  const renderSidebarContent = (slug: string) => {
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
    <ApplicationContentWrapper
      headerHeight={0}
      open={true}
      maxWidth={500}
      contentFullWidth={true}
      menuItems={sidebarMenuItems}
    >
      {renderSidebarContent(property)}
      <Map
        editable={true}
        geojson={geoJsonPolygon}
        onChangeGeojson={(geojson) => {
          console.log(geojson);
        }}
        coords={[51.051772741784625, 13.72531677893111]}
      />
    </ApplicationContentWrapper>
  );
};

export default ModflowContainer;
