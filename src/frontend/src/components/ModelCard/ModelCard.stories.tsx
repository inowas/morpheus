import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import ModelCard from './ModelCard';
import {IModelCard} from './types/ModelCard.type';


const item: IModelCard = {
  id: 3,
  model_description: 'Small model at NU campus',
  model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
  model_title: 'Simulation ofSUDS impact',
  model_Link: '/tools/04',
  model_map: '/tools/01',
  meta_author_avatar: '/author/EmilyBrown.jpeg',
  meta_author_name: 'Emily Brown',
  meta_link: 'https://metaLink4',
  meta_text: new Date().toLocaleDateString(),
  meta_status: true,
};

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Modflow/ModelCard',
  component: ModelCard,
} as Meta<typeof ModelCard>;


export const ModelItemExample: StoryFn<typeof ModelCard> = () =>
  <div style={{width: '380px'}}>
    <ModelCard
      data={item}
      navigateTo={() => {
      }}
      onDeleteButtonClick={() => {
      }}
      onCopyButtonClick={() => {
      }}
    />
  </div>

;
