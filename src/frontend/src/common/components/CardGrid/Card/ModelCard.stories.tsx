// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import ModelCard, {ICard} from './index';

import React from 'react';


const item: ICard = {
  key: 3,
  description: 'Small model at NU campus',
  image:
    'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
  title: 'Simulation ofSUDS impact',
  author: 'Emily Brown',
  date_time: new Date().toLocaleDateString(),
  status: 'green',
};

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Projects/Card',
  component: ModelCard,
} as Meta<typeof ModelCard>;

export const ModelItemExample: StoryFn<typeof ModelCard> = () => {
  return (
    <div style={{width: '380px'}}>
      <ModelCard
        key={item.id}
        title={item.title}
        description={item.description}
        date_time={item.date_time}
        status={item.status}
      />
    </div>
  );
};
