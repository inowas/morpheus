import {CardGrid} from 'common/components';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import React from 'react';

import {ICard} from 'common/components/CardGrid/Card';

const models: ICard[] = [
  {
    key: 0,
    description: 'A comprehensive guide to React development',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    title: 'React Mastery: The Complete Guide',
    author: 'John Doe',
    date_time: new Date().toISOString(),
    status: 'green',
  },
  {
    key: 1,
    description: 'Explore the world of machine learning with Python',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    title: 'Machine Learning with Python',
    author: 'Jane Smith',
    date_time: new Date().toISOString(),
    status: 'yellow',
  },
  {
    key: 2,
    description: 'Base model in the Ezousa valley',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    title: 'Ezousa MAR site',
    author: 'Catalin Stefan',
    date_time: new Date().toISOString(),
    status: 'green',
  },
  {
    key: 3,
    description: 'Small model at NU campus',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    title: 'Simulation ofSUDS impact',
    author: 'Emily Brown',
    date_time: new Date().toISOString(),
    status: 'green',
  },
  {
    key: 4,
    description: 'Explore the world of data science and analytics',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    title: 'Data Science Foundations',
    author: 'David Wilson',
    date_time: new Date().toISOString(),
    status: 'green',
  },
  {
    key: 5,
    description: 'Introduction to cybersecurity and its applications',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    title: 'Cybersecurity Basics',
    author: 'Alice Johnson',
    date_time: '15.10.2023',
    status: 'green',
  },
  {
    key: 6,
    description: 'Discover the fundamentals of cloud computing',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg',
    title: 'Cloud Computing Essentials',
    author: 'James Smith',
    date_time: new Date().toISOString(),
    status: 'red',
  },
  {
    key: 7,
    description: 'Model description 1',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    title: 'Model Title 1',
    author: 'Catalin Stefan',
    date_time: new Date().toISOString(),
    status: 'green',
  },
  {
    key: 8,
    description: 'Model description 2',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg',
    title: 'Model Title 2',
    author: 'Catalin Stefan',
    date_time: new Date().toISOString(),
    status: 'red',
  },
  {
    key: 9,
    description: 'Model description 3',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    title: 'Model Title 3',
    author: 'Catalin Stefan',
    date_time: new Date().toISOString(),
    status: 'green',
  },
  {
    key: 10,
    description: 'Model description 4',
    image: 'image_url_4.jpg',
    title: 'Model Title 4',
    author: 'Catalin Stefan',
    date_time: new Date().toISOString(),
    status: 'green',
  },
  {
    key: 11,
    description: 'Model description 5',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    title: 'Model Title 5',
    author: 'Catalin Stefan',
    date_time: new Date().toISOString(),
    status: 'red',
  },
  {
    key: 12,
    description: 'Exploring Advanced Data Structures',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    title: 'Advanced Data Structures',
    author: 'Catalin Stefan',
    date_time: new Date().toISOString(),
    status: 'green',
  },
  {
    key: 13,
    description: 'Introduction to Quantum Computing',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    title: 'Quantum Computing Basics',
    author: 'Catalin Stefan',
    date_time: new Date().toISOString(),
    status: 'red',
  },
  {
    key: 14,
    description: 'Optimizing Neural Network Architectures',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    title: 'Neural Network Optimization',
    author: 'Catalin Stefan',
    date_time: new Date().toISOString(),
    status: 'green',
  },
  {
    key: 15,
    description: 'Advanced Algorithms in Computational Biology',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg',
    title: 'Computational Biology Algorithms',
    author: 'Catalin Stefan',
    date_time: new Date().toISOString(),
    status: 'red',
  },
  {
    key: 16,
    description: 'Introduction to Natural Language Processing',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    title: 'Natural Language Processing Basics',
    author: 'Catalin Stefan',
    date_time: new Date().toISOString(),
    status: 'green',
  },
  {
    key: 17,
    description: 'Exploring Big Data Management Techniques',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    title: 'Big Data Management',
    author: 'Catalin Stefan',
    date_time: new Date().toISOString(),
    status: 'red',
  },
];

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Projects/CardGrid',
  component: CardGrid,
} as Meta<typeof CardGrid>;


export const ModelGridExample: StoryFn<typeof CardGrid> = () => {
  return (
    <CardGrid
      title={'All projects'}
      cards={models}
    />
  );
};
