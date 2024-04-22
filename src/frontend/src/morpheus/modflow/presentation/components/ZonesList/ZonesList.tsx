import {Checkbox, Table} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import {DotsMenu} from 'common/components';
import styles from './ZonesList.module.less';

interface IZones {
  name: string;
  coordinates: number;
}

interface IZonesProps {
  zones: IZones[];
}

const ZonesList = ({zones}: IZonesProps) => {
  const [zoneData, setZoneData] = useState<IZones[]>(zones);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  const handleCheckboxChange = (name: string) => {
    setSelectedZones(prevSelected => {
      if (prevSelected.includes(name)) {
        return prevSelected.filter(zoneName => zoneName !== name);
      } else {
        return [...prevSelected, name];
      }
    });
  };

  const handleCoordinateChange = (index: number, value: number) => {
    const updatedZones = [...zoneData];
    updatedZones[index].coordinates = value;
    setZoneData(updatedZones);
  };

  const handleDelete = (value: string) => {
    const updatedZones = zoneData.filter(zone => zone.name !== value);
    const updatedSelectedZones = selectedZones.filter(zoneName => zoneName !== value);
    setZoneData(updatedZones);
    setSelectedZones(updatedSelectedZones);
  };

  useEffect(() => {
    console.log(zoneData);
    console.log(selectedZones);
  }, [selectedZones, zoneData]);

  return (
    <>
      <div className={styles.header}>
        <span>Name</span>
        <span>Value (m a.s.l.)</span>
      </div>
      <div className={styles.container}>
        <Table basic={true} className={styles.table}>
          <Table.Body>
            {zoneData.map((zone, index) => (
              <Table.Row key={index}>
                <Table.Cell width={9}>
                  <Checkbox
                    className={styles.checkbox}
                    label={zone.name}
                    name={zone.name}
                    checked={selectedZones.includes(zone.name)}
                    onChange={() => handleCheckboxChange(zone.name)}
                  />
                </Table.Cell>
                <Table.Cell width={5}>
                  <input
                    type="number"
                    value={zone.coordinates}
                    onChange={(e) => handleCoordinateChange(index, parseFloat(e.target.value))}
                    step={0.1}
                  />
                </Table.Cell>
                <Table.Cell width={2}>
                  <DotsMenu
                    className={styles.dotsMenu}
                    actions={[
                      {text: 'Delete', icon: 'remove', onClick: () => handleDelete(zone.name)},
                    ]}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default ZonesList;
