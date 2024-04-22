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
  const [polygonData, setPolygonData] = useState<IZones[]>(zones);
  const [selectedPolygons, setSelectedPolygons] = useState<string[]>([]);

  const handleCheckboxChange = (name: string) => {
    setSelectedPolygons(prevSelected => {
      if (prevSelected.includes(name)) {
        return prevSelected.filter(polygonName => polygonName !== name);
      } else {
        return [...prevSelected, name];
      }
    });
  };

  const handleCoordinateChange = (index: number, value: number) => {
    const updatedPolygons = [...polygonData];
    updatedPolygons[index].coordinates = value;
    setPolygonData(updatedPolygons);
  };

  const handleDelete = (value: string) => {
    const updatedPolygons = polygonData.filter(polygon => polygon.name !== value);
    const updatedSelectedPolygons = selectedPolygons.filter(polygonName => polygonName !== value);
    setPolygonData(updatedPolygons);
    setSelectedPolygons(updatedSelectedPolygons);
  };

  useEffect(() => {
    console.log(polygonData);
    console.log(selectedPolygons);
  }, [selectedPolygons, polygonData]);

  return (
    <>
      <div className={styles.header}>
        <span>Name</span>
        <span>Value (m a.s.l.)</span>
      </div>
      <div className={styles.container}>
        <Table basic={true} className={styles.table}>
          <Table.Body>
            {polygonData.map((polygon, index) => (
              <Table.Row key={index}>
                <Table.Cell width={9}>
                  <Checkbox
                    className={styles.checkbox}
                    label={polygon.name}
                    name={polygon.name}
                    checked={selectedPolygons.includes(polygon.name)}
                    onChange={() => handleCheckboxChange(polygon.name)}
                  />
                </Table.Cell>
                <Table.Cell width={5}>
                  <input
                    type="number"
                    value={polygon.coordinates}
                    onChange={(e) => handleCoordinateChange(index, parseFloat(e.target.value))}
                    step={0.1}
                  />
                </Table.Cell>
                <Table.Cell width={2}>
                  <DotsMenu
                    className={styles.dotsMenu}
                    actions={[
                      {text: 'Delete', icon: 'remove', onClick: () => handleDelete(polygon.name)},
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
