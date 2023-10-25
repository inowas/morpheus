import React, {useState} from 'react';
import {useNavigate, useTranslate} from '../../application';
import {Button} from 'semantic-ui-react';
import {Breadcrumb} from 'components';
import SimpleToolGrid from 'components/SimpleToolGrid';
import {GEOJSON} from './geojson';
import type {FeatureCollection} from 'geojson';
import styles from './T03Container.module.less';

import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import {Map} from '../../../../components/Map';

const tool = 'T03';

const T03 = () => {
  const [geojson, setGeojson] = React.useState<FeatureCollection>(GEOJSON);
  const navigateTo = useNavigate();
  const {translate} = useTranslate();
  const title = `${tool}: ${translate(`${tool}_title`)}`;
  const coords: [number, number] = [51.051772741784625, 13.72531677893111];
  const [editable, setEditable] = useState(true);

  const toggleEditingOn = () => {
    setEditable(true);
  };

  const toggleEditingOff = () => {
    setEditable(false);
  };

  return (
    <div data-testid="t02-container">
      <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />
      <SimpleToolGrid rows={2}>
        <div className={styles.wrapper}>
          <h3>{geojson.features.length} Features</h3>
          <pre>{JSON.stringify(geojson, null, 2)}</pre>
        </div>
        <div className={styles.wrapper}>
          <Map
            editable={editable}
            geojson={geojson}
            setGeojson={setGeojson}
            coords={coords}
          />
          <div className={styles.wrapperButtons}>
            <Button
              primary={true} onClick={toggleEditingOn}
              disabled={editable}
            >
              Edit
            </Button>
            <Button
              secondary={true} onClick={toggleEditingOff}
              disabled={!editable}
            >
              Save
            </Button>
          </div>

        </div>
      </SimpleToolGrid>
    </div>
  );
};

export default T03;
