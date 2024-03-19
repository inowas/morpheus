import React from 'react';
import {BodyContent, SidebarContent} from '../components';
import {LayersBody, LayersContent} from '../components/Layers';


const LayersContainer = () => {
  return (
    <>
      <SidebarContent maxWidth={700}>
        <LayersContent/>
      </SidebarContent>
      <BodyContent>
        <LayersBody/>
      </BodyContent>
    </>
  );
};

export default LayersContainer;
