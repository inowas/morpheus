import React from 'react';
import {DotsMenu, MovableList} from 'common/components';
import styles from './LayerPropertyValuesZonesList.module.less';
import {IAffectedCells} from '../../../types';
import {MultiPolygon, Polygon} from 'geojson';

export interface IZonesListItem {
  zone_id?: string;
  disabled?: boolean;
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

  const handleDisable = (idx: number) => {
    onChange(
      zones.map((zone, key) => {
        if (key === idx) {
          return {...zone, disabled: !zone.disabled}; // Toggle the disabled state
        }
        return zone;
      }),
    );
  };

  const handleDelete = (idx: number) => onChange(zones.filter((zone, key) => key !== idx));

  const updatedMovableItems = zones.map((zone, idx) => ({
    disabled: zone.disabled ? zone.disabled : false,
    key: zone.zone_id ? zone.zone_id : String(idx),
    name: zone.name,
    element: (
      <div className={`${styles.zoneListItem} ${zone.disabled ? styles.zoneListItemDisabled : ''}`}>
        <div className={styles.zoneListItemName}>
          <input
            type="text"
            value={zone.name}
            onChange={(e) => handleChangeName(idx, e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className={styles.zoneListItemValue}>
          <input
            type="number"
            value={zone.value}
            onChange={(e) => handleChangeValue(idx, parseFloat(e.target.value) || 0)}
            step={Math.pow(10, -precision)}
            disabled={readOnly}
          />
        </div>
        {!readOnly && (
          <div className={styles.zoneListItemButton}>
            <DotsMenu
              className={styles.dotsMenu}
              actions={[
                {text: zone.disabled ? 'Enable' : 'Disable', icon: 'ban', onClick: () => handleDisable(idx)},
                {text: 'Edit', icon: 'edit outline', onClick: () => console.log('Edit zone ', idx)},
                {text: 'Delete', icon: 'remove', onClick: () => handleDelete(idx)},
              ]}
            />
          </div>
        )}
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
      <MovableList
        items={zones}
        renderListItem={updatedMovableItems}
        onChange={onChange}
      />
    </div>
  );
};

export default LayerPropertyValuesZonesList;
