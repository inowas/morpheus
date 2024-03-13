import {ModelGeometry, ModelMetaData, ModelProperties, ModelStressPeriods, ModelTest} from 'common/components/Models';
import {ApplicationContentWrapper, Footer, Header, IPageWidth, Map} from 'common/components';
import React, {useEffect, useState} from 'react';
import {useNavbarItems, useTranslate} from '../../application';
import {useLocation, useNavigate, useReleaseVersion} from 'common/hooks';

import type {FeatureCollection} from 'geojson';
import menuItems from 'common/components/SidebarMenu/MenuItems';

type ILanguageCode = 'de-DE' | 'en-GB';

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

const ProjectContainer = () => {

  const {i18n} = useTranslate();
  const {navbarItems} = useNavbarItems();
  const [language, setLanguage] = useState<ILanguageCode>(i18n.language as ILanguageCode);
  const navigateTo = useNavigate();
  const location = useLocation();
  const {release} = useReleaseVersion();
  const pageSize: IPageWidth = 'auto';
  const [headerHeight, setHeaderHeight] = useState(0);
  const [listItems, setListItems] = useState(menuItems);

  const handleItemClick = (index: number) => {
    const updatedListParameters = listItems.map((item, i) => {
      return (i === index) ? {...item, active: true} : {...item, active: false};
    });
    setListItems(updatedListParameters);
  };

  const updateHeaderHeight = (height: number) => {
    setHeaderHeight(height);
  };

  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const languageList: { code: ILanguageCode; label: string }[] = [
    {
      code: 'en-GB',
      label: 'English',
    },
  ];

  const currentContent = listItems.find(item => item.active)?.description;

  const SidebarContent = () => {
    switch (currentContent) {
    case 'Grid properties':
      return <ModelGeometry/>;
    case 'Stress periods':
      return <ModelStressPeriods/>;
    case 'Model layers':
      return <ModelProperties/>;
    case 'Boundary conditions':
      return 'Boundary conditions';
    case 'Head observations':
      return 'Head observations';
    case 'Solute transport':
      return 'Solute transport';
    case 'Variable density flow':
      return 'Variable density flow';
    case 'Meta Data':
      return <ModelMetaData/>;
    case 'Test':
      return <ModelTest/>;


    default:
      return <pre style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        Coming soon
      </pre>;
    }
  };


  return (
    <>
      <Header
        maxWidth={pageSize}
        updateHeight={updateHeaderHeight}
        navbarItems={navbarItems}
        languageList={languageList}
        language={language}
        onChangeLanguage={setLanguage}
        navigateTo={navigateTo}
        pathname={location.pathname}
        showSearchWrapper={true}
        showCreateButton={true}
        showSidebarMenu={!!menuItems}

      />
      <ApplicationContentWrapper
        headerHeight={headerHeight}
        open={true}
        maxWidth={700}
        contentFullWidth={true}
        menuItems={listItems}
        handleItemClick={handleItemClick}
      >
        <SidebarContent/>
        <Map
          editable={true}
          geojson={geoJsonPolygon}
          onChangeGeojson={(geojson) => {
            console.log(geojson);
          }}
          coords={[51.051772741784625, 13.72531677893111]}
        />
      </ApplicationContentWrapper>
      <Footer release={release} maxWidth={pageSize}/>
    </>
  );
};

export default ProjectContainer;
