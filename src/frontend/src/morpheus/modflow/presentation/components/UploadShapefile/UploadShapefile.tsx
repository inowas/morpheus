import React, {useEffect, useState} from 'react';
import {Button, MapExample, Modal, SectionTitle, ShapeFileInput, Tab} from 'common/components';
// import ShapeFileInput from './ShapeFileInput';
import SelectBoundaries from './SelectBoundaries';
import styles from './UploadShapefile.module.less';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import jsonData from './jsonData.json';
import type {FeatureCollection} from 'geojson';

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


const UploadShapefile = () => {

  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [showShapeFileModal, setShowShapeFileModal] = useState(true);
  const [shapefile, setShapefile] = useState<File | null>(null);

  /*
    JSON file using for markup, should be replaced with Shape in the future
  */
  // const json = JSON.stringify(jsonData, null, 2);
  const stressPeriods = jsonData.map(item => ({id: item.id, name: item.name}));


  const panes = [
    {
      menuItem: 'Upload file',
      render: () => <Tab.TabPane>
        <div className={styles.wrapper}>
          <ShapeFileInput
            useDropzone={true}
            fileName={shapefile?.name}
            onSubmit={setShapefile}
          />
          <Button
            className='buttonLink'
            size={'tiny'}
            onClick={() => console.log('Download template')}
          >
            Download template
            <FontAwesomeIcon icon={faDownload}/>
          </Button>
        </div>
      </Tab.TabPane>,
    },
    {
      menuItem: 'Select boundaries', render: () => <Tab.TabPane>
        <SelectBoundaries stressPeriods={stressPeriods}/>
        <MapExample
          editable={false}
          geojson={geoJsonPolygon}
          onChangeGeojson={(geojson) => {
            console.log(geojson);
          }}
          coords={[51.051772741784625, 13.72531677893111]}
        />
      </Tab.TabPane>,
    },
    {menuItem: 'Assign properties', render: () => <Tab.TabPane>Assign properties</Tab.TabPane>},
  ];

  const handleCancel = () => {
    setShapefile(null);
    setShowShapeFileModal(false);
  };

  const handleSave = () => {
    console.log('handleSave');
  };

  useEffect(() => {
    if (shapefile) {
      setActiveIndex(1);
      console.log(shapefile);
    }
  }, [shapefile]);

  return (
    <>
      <Button style={{marginBottom: '40px'}} onClick={() => setShowShapeFileModal(!showShapeFileModal)}>
        Upload shapefile
      </Button>


      <Modal.Modal
        style={{zIndex: '10000'}}
        open={showShapeFileModal}
        onClose={() => setShowShapeFileModal(!showShapeFileModal)}
        dimmer={'inverted'}
      >
        <Modal.Content>
          <SectionTitle title={'Import WELL boundaries'}/>
          <Tab
            className={styles.tabs}
            activeIndex={activeIndex}
            onTabChange={(e, data) => {
              setActiveIndex((data.activeIndex && 'number' === typeof data.activeIndex) ? data.activeIndex : 0);
            }}
            variant="primary"
            menu={{secondary: true, pointing: true}}
            panes={panes}
          />
          <Modal.Actions>
            <Button
              style={{
                fontSize: '17px',
                textTransform: 'capitalize',
                minWidth: '90px',
              }}
              onClick={handleCancel}
            >Cancel</Button>
            <Button
              style={{
                fontSize: '17px',
                textTransform: 'capitalize',
                minWidth: '90px',
              }}
              primary={!!shapefile}
              disabled={!(null !== shapefile)}
              onClick={handleSave}
            >
              Apply
            </Button>
          </Modal.Actions>
        </Modal.Content>
      </Modal.Modal>
    </>
  );
};

export default UploadShapefile;
