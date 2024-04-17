import React from 'react';
import {BodyContent, SidebarContent} from '../components';
import {LayersBody, LayersContent} from '../components/ModelLayers';


const LayersContainer = () => {
  return (
    <>
      <SidebarContent maxWidth={650}>
        <LayersContent/>
      </SidebarContent>
      <BodyContent>
        <LayersBody/>
      </BodyContent>
    </>
  );
};

export default LayersContainer;
