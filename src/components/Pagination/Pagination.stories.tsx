import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Pagination from './Pagination';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Pagination',
  component: Pagination,
} as ComponentMeta<typeof Pagination>;


export const PaginationExample: ComponentStory<typeof Pagination> = () => (
  <Pagination
    className='paginationBar'
    defaultActivePage={1}
    firstItem={null}
    lastItem={null}
    totalPages={10}
  />
);
