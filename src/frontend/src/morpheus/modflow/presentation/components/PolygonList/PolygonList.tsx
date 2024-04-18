import {Checkbox, Table} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import {DotsMenu} from 'common/components';
import styles from './PolygonList.module.less';

interface IPolygon {
  name: string;
  coordinates: number;
}

interface IProps {
  polygons: IPolygon[];
}

const PolygonList = ({polygons}: IProps) => {
  const [polygonData, setPolygonData] = useState<IPolygon[]>(polygons);
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
                <Table.Cell width={8}>
                  <div className={styles.name}>
                    <Checkbox
                      checked={selectedPolygons.includes(polygon.name)}
                      onChange={() => handleCheckboxChange(polygon.name)}
                    />
                    {polygon.name}
                  </div>
                </Table.Cell>
                <Table.Cell width={6}>
                  <div className="">
                    <input
                      type="number"
                      value={polygon.coordinates}
                      onChange={(e) => handleCoordinateChange(index, parseFloat(e.target.value))}
                      step={0.1}
                    />
                  </div>
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

export default PolygonList;
