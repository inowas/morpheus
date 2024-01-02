import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import {Header, IPageWidth, ModelWrapper} from 'components';


const navbarItems2 = [
  {
    name: 'home', label: 'Home', admin: false, basepath: '/', subMenu: [
      {name: 'T02', label: 'T02: Groundwater Mounding (Hantush)', admin: false, to: '/tools/T02'},
      {name: 'T04', label: 'T04: Database for GIS-based Suitability Mapping', admin: false, to: '/tools/T04'}],
  },
  {name: 'filters', label: 'Filters', admin: false, to: '/tools'},
  {name: 'documentation', label: 'Documentation', admin: false, to: '/modflow'},
];


export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Modflow/ModelWrapper',
  component: ModelWrapper,
} as Meta<typeof ModelWrapper>;

export const ModelWrapperPageExample: StoryFn<typeof ModelWrapper> = () => {
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const updateHeaderHeight = (height: number) => {
    setHeaderHeight(height);
  };
  const pageSize: IPageWidth = 'auto';

  return (
    <div style={{margin: '-1rem'}}>
      <Header
        maxWidth={pageSize}
        navbarItems={navbarItems2}
        navigateTo={() => {
        }}
        pathname={'/'}
        showSearchWrapper={true}
        showCreateButton={true}
        showModelSidebar={true}
        updateHeight={updateHeaderHeight}
      />
      <ModelWrapper
        headerHeight={headerHeight}
        showModelSidebar={true}
        style={{position: 'relative', zIndex: 0}}
      ></ModelWrapper>
    </div>
  );
};

