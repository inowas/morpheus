import React, {useEffect, useState} from 'react';
import {Button, MapExample, Modal, SectionTitle, ShapeFileInput, Tab} from 'common/components';
import {List, ListItem} from 'semantic-ui-react';

import SelectBoundaries from './SelectBoundaries';
import AssignProperties from './AssignProperties';
import styles from './ModalShapefile.module.less';
import type {FeatureCollection} from 'geojson';
import jsonData from './jsonData.json';

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

export interface IStressPeriod {
  id: string;
  name: string;
  layer: string;
  stress_period_data: { date: string; latitude: number }[];
}

interface IModalShapefile {
  open: boolean;
  onSave: (data: any) => void
  onCancel: () => void;
}


const ModalShapefile = ({open, onSave, onCancel}: IModalShapefile) => {

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [dataInput, setDataInput] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  /*
  JSON file using for markup, should be replaced with Shape in the future
  const json = JSON.stringify(jsonData, null, 2);
  */
  const layers = jsonData.map(item => ({id: item.id, name: item.name}));

  const [fileList, setFileList] = useState([
    {id: '0', name: 'filename.json'},
    {id: '1', name: 'filename2.json'},
    {id: '2', name: 'filename3.json'},
    {id: '3', name: 'filename4.json'},
    {id: '4', name: 'filename5.json'},
    {id: '5', name: 'filename6.json'},
  ]);


  useEffect(() => {
    if (dataInput) {
      setActiveIndex(1);
      setFileName(dataInput.name);
      const newFile = {id: dataInput.name, name: dataInput.name};
      setFileList(prevFileList => [...prevFileList, newFile]);
    }
  }, [dataInput]);

  const panes = [
    {
      menuItem: 'Upload file', render: () => <Tab.TabPane>
        <div className={styles.wrapper}>
          <div className={styles.fileList}>
            <SectionTitle subTitle={'File list'}/>
            <List className={styles.list}>
              {fileList.map(file => (
                <ListItem key={file.id} className={styles.listItem}>
                  {file.name}
                </ListItem>
              ))}
            </List>
          </div>
          <ShapeFileInput
            centered={true}
            useDropzone={true}
            onSubmit={setDataInput}
            fileName={fileName}
          />
        </div>
      </Tab.TabPane>,
    },
    {
      menuItem: 'Select boundaries', render: () => <Tab.TabPane>
        <SelectBoundaries layers={layers}/>
        <MapExample
          style={{height: 'auto'}}
          editable={false}
          geojson={geoJsonPolygon}
          onChangeGeojson={(geojson) => {
            console.log(geojson);
          }}
          coords={[51.051772741784625, 13.72531677893111]}
        />
      </Tab.TabPane>,
    },
    {
      menuItem: 'Assign properties', render: () => <Tab.TabPane active={false}>
        <AssignProperties stressPeriods={jsonData}/>
      </Tab.TabPane>,
    },
  ];

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = () => {
    onSave(jsonData);
  };


  return (
    <Modal.Modal
      style={{zIndex: '10000'}}
      open={open}
      onClose={handleCancel}
      dimmer={'inverted'}
    >
      <Modal.Content>
        <SectionTitle title={'Import WELL boundaries'}/>
        <Tab
          activeIndex={activeIndex}
          onTabChange={(e, data) => {
            if (!dataInput) {
              e.preventDefault();
            } else {
              setActiveIndex((data.activeIndex && 'number' === typeof data.activeIndex) ? data.activeIndex : 0);
            }
          }}
          className={`${styles.tabs} ${!dataInput ? styles.noUploadedFile : ''}`}
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
            primary={!!dataInput}
            disabled={!dataInput}
            onClick={handleSave}
          >
            Apply
          </Button>
        </Modal.Actions>
      </Modal.Content>
    </Modal.Modal>
  );
};

export default ModalShapefile;
