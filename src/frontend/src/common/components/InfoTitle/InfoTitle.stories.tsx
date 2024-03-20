// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import InfoTitle from 'common/components/InfoTitle';
import React from 'react';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'InfoTitle',
  component: InfoTitle,
} as Meta<typeof InfoTitle>;

export const InfoTitleExample: StoryFn<typeof InfoTitle> = () => {
  return (
    <>
      <InfoTitle title="Upload raster" description="raster description"/>
      <InfoTitle
        title="Upload shapefile"
        description="Shapefile description"
        actions={[
          {actionText: 'Active cells', actionDescription: 'Action Description', onClick: () => console.log('Action 2')},
        ]}
      />
      <InfoTitle
        title="Upload shapefile"
        description="Shapefile description"
        actions={[
          {actionText: 'Edit domain', actionDescription: 'Action Description', onClick: () => console.log('Action 1')},
          {actionText: 'Active cells', actionDescription: 'Action Description', onClick: () => console.log('Action 2')},
        ]}
      />

      <InfoTitle
        title="Upload raster (secondary)"
        secondary={true}
        description="raster description"
      />
      <InfoTitle
        title="Upload shapefile (secondary)"
        secondary={true}
        description="Shapefile description"
        actions={[
          {actionText: 'Active cells', actionDescription: 'Action Description', onClick: () => console.log('Action 2')},
        ]}
      />
      <InfoTitle
        title="Upload shapefile (secondary)"
        secondary={true}
        description="Shapefile description"
        actions={[
          {actionText: 'Edit domain', actionDescription: 'Action Description', onClick: () => console.log('Action 1')},
          {actionText: 'Active cells', actionDescription: 'Action Description', onClick: () => console.log('Action 2')},
        ]}
      />
      <InfoTitle
        title="Upload shapefile (secondary)"
        secondary={true}
        description="Shapefile description"
        actions={[
          {actionText: 'Active cells', actionDescription: 'Action Description', onClick: () => console.log('Action 2')},
        ]}
      />
      <InfoTitle
        title="Upload shapefile (secondary)"
        secondary={true}
        description="Shapefile description"
        actions={[
          {actionText: 'Edit domain', actionDescription: 'Action Description'},
          {actionText: 'Active cells', actionDescription: 'Action Description'},
        ]}
      />
    </>
  );
};

