import {Checkbox, Table} from 'semantic-ui-react';
import React from 'react';
import {Button} from 'common/components';
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
    onChange(zones.map((zone, idx) => {
      if (idx === key) {
        return {...zone, name: value};
      }
      return zone;
    }));
  };

  const handleChangeValue = (key: number, value: number) => {
    onChange(zones.map((zone, idx) => {
      if (idx === key) {
        return {...zone, value};
      }
      return zone;
    }));
  };

  const handleDelete = (idx: number) => onChange(zones.filter((zone, key) => key !== idx));

  if (0 === zones.length) {
    return (<div>No zones specified</div>);
  }

  return (
    <>
      <div className={styles.header}>
        <span>Name</span>
        <span>Value (m a.s.l.)</span>
      </div>
      <div className={styles.container}>
        <Table basic={true} className={styles.table}>
          <Table.Body>
            {zones.map((zone, idx) => (
              <Table.Row key={idx}>
                <Table.Cell width={2}>
                  <Checkbox disabled={true} checked={true}/>
                </Table.Cell>
                <Table.Cell width={5}>
                  <input
                    value={zone.name}
                    onChange={(e) => handleChangeName(idx, e.target.value)}
                    disabled={readOnly}
                  />
                </Table.Cell>
                <Table.Cell width={5}>
                  <input
                    type={'number'}
                    value={zone.value}
                    onChange={(e) => handleChangeValue(idx, parseFloat(e.target.value) || 0)}
                    step={Math.pow(10, -precision)}
                    disabled={readOnly}
                  />
                </Table.Cell>
                <Table.Cell width={4}>
                  {!readOnly && <Button
                    icon={'trash'}
                    size={'tiny'}
                    color={'red'}
                    onClick={() => handleDelete(idx)}
                    style={{minWidth: '20px', margin: 10}}
                    disabled={readOnly}
                  />}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default LayerPropertyValuesZonesList;
