import React from 'react';
import {DotsMenu, MovableList} from 'common/components';
import styles from './LayerPropertyValuesZonesList.module.less';
import {IAffectedCells} from '../../../types';
import {MultiPolygon, Polygon} from 'geojson';

export interface IZonesListItem {
  zone_id?: string;
  name: string;
  affected_cells?: IAffectedCells;
  geometry: Polygon | MultiPolygon;
  value: number;
}

interface IProps {
  zones: IZonesListItem[];
  onChange: (zones: IZonesListItem[]) => void;
  precision?: number;
  readOnly: boolean;
}

const LayerPropertyValuesZonesList = ({zones, onChange, precision = 2, readOnly}: IProps) => {

  const handleChangeName = (key: number, value: string) => {
    onChange(
      zones.map((zone, idx) => {
        if (idx === key) {
          return {...zone, name: value};
        }
        return zone;
      }),
    );
  };

  const handleChangeValue = (key: number, value: number) => {
    onChange(
      zones.map((zone, idx) => {
        if (idx === key) {
          return {...zone, value};
        }
        return zone;
      }),
    );
  };

  const handleDelete = (idx: number) => onChange(zones.filter((zone, key) => key !== idx));

  const updatedMovableItems = zones.map((zone, idx) => ({
    key: zone.zone_id ? zone.zone_id : String(idx),
    name: zone.name,
    element: (
      <div className={styles.zoneListBody}>
        <div className={styles.zoneListName}>
          <input
            type="text"
            value={zone.name}
            onChange={(e) => handleChangeName(idx, e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className={styles.zoneListValue}>
          <input
            type="number"
            value={zone.value}
            onChange={(e) => handleChangeValue(idx, parseFloat(e.target.value) || 0)}
            step={Math.pow(10, -precision)}
            disabled={readOnly}
          />
        </div>
        <div className={styles.zoneListButton}>
          {!readOnly && (
            <DotsMenu
              className={styles.dotsMenu}
              actions={[
                {text: 'Edit', icon: 'edit outline', onClick: () => console.log('Edit zone ', idx)},
                {text: 'Delete', icon: 'remove', onClick: () => handleDelete(idx)},
              ]}
            />
          )}
        </div>
      </div>
    ),
  }));

  if (0 === zones.length) {
    return <div>No zones specified</div>;
  }

  return (
    <div className={styles.zoneList}>
      <div className={styles.header}>
        <span>Name</span>
        <span>Value (m a.s.l.)</span>
      </div>
      <div className={styles.container}>
        <MovableList
          items={zones}
          renderListItem={updatedMovableItems}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default LayerPropertyValuesZonesList;
