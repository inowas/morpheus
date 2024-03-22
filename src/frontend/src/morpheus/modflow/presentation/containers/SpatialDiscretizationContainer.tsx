import React, {useState} from 'react';
import {BodyContent, SidebarContent} from '../components';
import type {Polygon} from 'geojson';
import {Body, SpatialDiscretizationContent} from '../components/SpatialDiscretization';


const geoJsonPolygon: Polygon = {
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
};

const SpatialDiscretizationContainer = () => {

  const [geometry, setGeometry] = useState<Polygon>();
  const [locked, setLocked] = useState<boolean>(false);

  return (
    <>
      <SidebarContent maxWidth={700}>
        <SpatialDiscretizationContent
          locked={locked}
          onChangeLock={setLocked}
          onChange={() => console.log('changed')}
        />
      </SidebarContent>
      <BodyContent>
        <Body
          polygon={geometry}
          onChange={setGeometry}
          editable={!locked}
        />
      </BodyContent>
    </>
  );
};

export default SpatialDiscretizationContainer;
