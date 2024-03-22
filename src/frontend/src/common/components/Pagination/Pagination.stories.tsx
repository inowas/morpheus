// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";

import Pagination from "./Pagination";
import React from "react";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Pagination",
  component: Pagination,
} as Meta<typeof Pagination>;

export const PaginationExample: StoryFn<typeof Pagination> = () => (
  <Pagination
    className="paginationBar"
    defaultActivePage={1}
    firstItem={null}
    lastItem={null}
    totalPages={10}
  />
);
