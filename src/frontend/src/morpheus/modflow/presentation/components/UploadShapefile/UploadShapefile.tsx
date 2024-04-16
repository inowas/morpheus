import React, {useEffect, useState} from 'react';
import {Button, Modal, SectionTitle, Tab} from 'common/components';
import UploadFile from './UploadFile';
import styles from './UploadShapefile.module.less';
import {FileWithPath} from 'react-dropzone';
import * as Papa from 'papaparse';

const UploadShapefile = () => {
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showShapeFileModal, setShowShapeFileModal] = useState(true);
  const [shapefile, setShapefile] = useState<FileWithPath | null>(null);

  const panes = [
    {
      menuItem: 'UploadFile',
      render: () => <Tab.TabPane>
        <UploadFile
          isCancelled={isCancelled}
          shapefile={shapefile}
          setShapefile={setShapefile}
        />
      </Tab.TabPane>,
    },
    {menuItem: 'Select boundaries', render: () => <Tab.TabPane>Select boundaries</Tab.TabPane>},
    {menuItem: 'Assign properties', render: () => <Tab.TabPane>Assign properties</Tab.TabPane>},
  ];

  const handleCancel = () => {
    setIsCancelled(true);
    setShapefile(null);
    setShowShapeFileModal(false);
  };

  const handleSave = () => {
    console.log(handleSave);
  };

  const handleParseCSV = (file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const csvData = Papa.parse(event.target.result as string);
        console.log('Parsed CSV data:', csvData.data);
      }
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    console.log(shapefile);
    if (shapefile) {
      setActiveIndex(1);
      handleParseCSV(shapefile);
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
