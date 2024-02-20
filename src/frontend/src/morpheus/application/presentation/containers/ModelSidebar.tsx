import React, {useEffect, useState} from 'react';
import {useIsEmbedded, useNavbarItems, useReleaseVersion, useTranslate} from '../../application';
import {Footer, Header, IPageWidth, Map, Sidebar} from 'components';
import {useLocation, useNavigate, useSearchParams} from 'common/hooks';
import type {FeatureCollection} from 'geojson';
import menuItems from 'components/SidebarMenu/MenuItems';
import {DataGrid, ModelGeometry, ModelMetaData, ModelProperties, ModelStressPeriods, ModelTest} from 'components/Models';

type ILanguageCode = 'de-DE' | 'en-GB';

const GEOJSON: FeatureCollection = {
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

const ModelSidebar = () => {

  const {i18n, translate} = useTranslate();
  const {navbarItems} = useNavbarItems();
  const [language, setLanguage] = useState<ILanguageCode>(i18n.language as ILanguageCode);
  const navigateTo = useNavigate();
  const location = useLocation();
  const {release} = useReleaseVersion();
  const [searchParams] = useSearchParams();
  const {isEmbedded, setIsEmbedded} = useIsEmbedded();
  const showHeader = !isEmbedded;
  const showFooter = !isEmbedded;
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

  if ('true' === searchParams.get('embedded') && !isEmbedded) {
    setIsEmbedded(true);
  }

  if ('false' === searchParams.get('embedded') && isEmbedded) {
    setIsEmbedded(false);
  }

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
      return <ModelProperties/>;
    case 'Test':
      return <DataGrid><ModelGeometry/><ModelTest/></DataGrid>;
    case 'Model layers':
      return <ModelMetaData/>;
    case 'Stress periods':
      return <ModelStressPeriods/>;
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
      {showHeader &&
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
          showSidebarMenu={menuItems ? true : false}

        />}
      <Sidebar
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
          geojson={GEOJSON}
          setGeojson={(geojson) => {
            console.log(geojson);
          }}
          coords={[51.051772741784625, 13.72531677893111]}
        />
      </Sidebar>
      {showFooter ? <Footer release={release} maxWidth={pageSize}/> :
        <span
          style={{
            margin: '0 auto',
            textAlign: 'center',
            fontSize: '0.8rem',
          }}
        >Release: {release}</span>
      }
    </>
  );
};

export default ModelSidebar;
