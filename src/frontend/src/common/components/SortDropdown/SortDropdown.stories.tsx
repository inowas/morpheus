// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import SortDropdown, {ISortOption} from './index';

import {IProjectCard} from '../ModelCard';
import React from 'react';

const sortOptions: ISortOption[] = [
  {text: 'Sort by Author', value: 'author'},
  {text: 'Most Recent', value: 'mostRecent'},
  {text: 'Less Recent', value: 'lessRecent'},
  {text: 'A-Z', value: 'aToZ'},
  {text: 'Z-A', value: 'zToA'},
  {text: 'Most Popular', value: 'mostPopular'},
];

const modelData: IProjectCard[] = [
  {
    id: 0,
    model_description: 'A comprehensive guide to React development',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    model_title: 'React Mastery: The Complete Guide',
    model_Link: '/tools/01',
    model_map: '/tools/01',
    meta_author_avatar: '/author/JohnDoe.jpeg',
    meta_author_name: 'John Doe',
    meta_link: 'https://metaLink1',
    meta_text: '20.11.2023',
    meta_status: false,
  },
  {
    id: 1,
    model_description: 'Explore the world of machine learning with Python',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    model_title: 'Machine Learning with Python',
    model_Link: '/tools/02',
    model_map: '/tools/01',
    meta_author_avatar: '/author/JaneSmith.jpeg',
    meta_author_name: 'Jane Smith',
    meta_link: 'https://metaLink2',
    meta_text: '20.11.2023',
    meta_status: false,
  },
  {
    id: 2,
    model_description: 'Base model in the Ezousa valley',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    model_title: 'Ezousa MAR site',
    model_Link: '/tools/03',
    model_map: '/tools/01',
    meta_author_avatar: '/author/RobertJohnson.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink3',
    meta_text: '20.11.2023',
    meta_status: true,
  },
  {
    id: 3,
    model_description: 'Small model at NU campus',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    model_title: 'Simulation ofSUDS impact',
    model_Link: '/tools/04',
    model_map: '/tools/01',
    meta_author_avatar: '/author/EmilyBrown.jpeg',
    meta_author_name: 'Emily Brown',
    meta_link: 'https://metaLink4',
    meta_text: '20.11.2023',
    meta_status: true,
  },
  {
    id: 4,
    model_description: 'Explore the world of data science and analytics',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    model_title: 'Data Science Foundations',
    model_Link: '/tools/05',
    model_map: '/tools/01',
    meta_author_avatar: '/author/DavidWilson.jpeg',
    meta_author_name: 'David Wilson',
    meta_link: 'https://metaLink5',
    meta_text: '01.11.2023',
    meta_status: true,
  },
];

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'SortDropdown',
  component: SortDropdown,
} as Meta<typeof SortDropdown>;


export const SortDropdownExample: StoryFn<typeof SortDropdown> = () =>
  <SortDropdown
    data={modelData}
    sortOptions={sortOptions}
    setModelData={(sortedData) => {
      console.log('Sorted Data:', sortedData);
    }}
    placeholder="Sort by..."
  >
    <h1>Children</h1>
  </SortDropdown>

;
