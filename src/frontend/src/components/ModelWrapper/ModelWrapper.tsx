import React, {useState} from 'react';
import styles from './ModelWrapper.module.less';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import {List, Radio} from 'semantic-ui-react';
import {DataGrid, DataRow, DataSidebar, ModelSidebar} from './index';
import {Map} from '../Map';
import type {FeatureCollection} from 'geojson';


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

const listParametrs = [
  {title: 'Layer confinement, calculation, reweting', active: false},
  {title: 'Top elevation(m a.s.l.)', active: true},
  {title: 'Bottom elevation(m a.s.l.)', active: false},
  {title: 'Hydraulic conductivity along rows(m/d)', active: false},
  {title: 'Horizontal hydraulic anisotropy(-)', active: false},
  {title: 'Vertical hydraulic conductivity(m/d)', active: false},
  {title: 'Specific storage(-)', active: false},
  {title: 'Specific yield(1/m)', active: false},
  {title: 'Starting head, strt(m a.s.l.)', active: false},
  {title: 'iBound(-)', active: false},
];

interface IProps {
  style?: React.CSSProperties;
}

const ModelWrapper: React.FC<IProps> = ({...props}) => {
  const [listItems, setListItems] = useState(listParametrs);

  const handleItemClick = (index: number) => {
    const updatedListParameters = listItems.map((item, i) => {
      return (i === index) ? {...item, active: true} : {...item, active: false};
    });
    setListItems(updatedListParameters);
  };

  return (
    <div className={styles.modelWrapper} {...props}>
      <ModelSidebar/>
      <div className={styles.modelContent}>
        <DataSidebar>
          <DataGrid>
            <DataRow title={'Model layers'}>
              <h2>Hello world box 1</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, nulla?</p>
            </DataRow>

            {/*<DataRow*/}
            {/*  title={'Grid properties'}*/}
            {/*  btnTitle={'Upload JSON'}*/}
            {/*  onClick={() => {console.log('handleUpdateJson'))}*/}
            {/*/>*/}

            {/*<DataRow*/}
            {/*  subTitle={'Grid resolution'}*/}
            {/*  btnTitle={'Refine grid'}*/}
            {/*  onClick={() => {console.log('handleUpdateJson'))}*/}
            {/*>*/}
            {/*  <h2>Hello world box 1</h2>*/}
            {/*  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, nulla?</p>*/}
            {/*</DataRow>*/}

            {/*<DataRow*/}
            {/*  subTitle={'Grid rotation'}*/}
            {/*>*/}
            {/*  <h2>Hello world box 1</h2>*/}
            {/*  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, nulla?</p>*/}
            {/*</DataRow>*/}

          </DataGrid>
          <DataGrid>
            <DataRow subTitle={'Shallow aquifer layer'}/>
          </DataGrid>
          <DataGrid multiRows={true}>
            <div className={styles.column}>
              <h3 className={`${styles.headline} h4`}>Layer parameters</h3>
              <List className={styles.list}>
                {listItems.map((item, index) => (
                  <List.Item
                    key={index}
                    as="a"
                    className={`${styles.item} ${item.active ? styles.active : ''}`}
                    onClick={() => handleItemClick(index)}
                  >
                    {item.title}
                  </List.Item>
                ))}
              </List>
            </div>
            <div className={styles.column}>
              <h4 className={`${styles.headline} h6`}>Layer confinement</h4>
              <div className={styles.radioGroup}>
                <Radio
                  className={styles.radio}
                  label="Confined"
                  value="confined"
                  checked={true}
                />
                <Radio
                  className={styles.radio}
                  label="Convertible"
                  value="convertible"
                />
                <Radio
                  className={styles.radio}
                  label="Convertible (unless THICKSTRT)"
                  value="thickStart"
                />

              </div>
              <h4 className={`${styles.headline} h6`}>Layer average calculation</h4>
              <div className={styles.radioGroup}>
                <Radio
                  className={styles.radio}
                  label="harmonic mean"
                  value="harmonicMean"
                  checked={true}
                />
                <Radio
                  className={styles.radio}
                  label="logarythmic mean"
                  value="logarythmicMean"
                />
                <Radio
                  className={styles.radio}
                  label="arithmetic mean (saturated thickness) and logarithmic mean (hydraulic conductivity)"
                  value="arithmetic"
                />

              </div>
              <h4 className={`${styles.headline} h6`}>Layer rewetting capability</h4>
              <div className={`${styles.radioGroup} ${styles.radioGroupRow}`}>
                <Radio
                  className={styles.radio}
                  label="yes"
                  value="yes"
                  checked={true}
                />
                <Radio
                  className={styles.radio}
                  label="no"
                  value="no"
                />
              </div>
            </div>
          </DataGrid>
        </DataSidebar>
        <div className={styles.modelMap}>
          <Map
            editable={true}
            geojson={GEOJSON}
            setGeojson={(geojson) => {
              console.log(geojson);
            }}
            coords={[51.051772741784625, 13.72531677893111]}
          />
        </div>
      </div>
    </div>
  );
};

export default ModelWrapper;
