// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";
import SortDropdown, { ISortOption } from "./index";

import { ICard } from "../Card";
import React from "react";

const sortOptions: ISortOption[] = [
  { text: "Sort by Author", value: "author" },
  { text: "Most Recent", value: "mostRecent" },
  { text: "Less Recent", value: "lessRecent" },
  { text: "A-Z", value: "aToZ" },
  { text: "Z-A", value: "zToA" },
  { text: "Most Popular", value: "mostPopular" },
];

const modelData: ICard[] = [
  {
    key: 0,
    description: "A comprehensive guide to React development",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    title: "React Mastery: The Complete Guide",
    author: "John Doe",
    date_time: new Date().toISOString(),
    status: "green",
  },
  {
    key: 1,
    description: "Explore the world of machine learning with Python",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg",
    title: "Machine Learning with Python",
    author: "Jane Smith",
    date_time: new Date().toISOString(),
    status: "yellow",
  },
  {
    key: 2,
    description: "Base model in the Ezousa valley",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    title: "Ezousa MAR site",
    author: "Catalin Stefan",
    date_time: new Date().toISOString(),
    status: "grey",
  },
  {
    key: 3,
    description: "Small model at NU campus",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg",
    title: "Simulation ofSUDS impact",
    author: "Emily Brown",
    date_time: new Date().toISOString(),
    status: "green",
  },
  {
    key: 4,
    description: "Explore the world of data science and analytics",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    title: "Data Science Foundations",
    author: "David Wilson",
    date_time: new Date().toISOString(),
    status: "yellow",
  },
];

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "SortDropdown",
  component: SortDropdown,
} as Meta<typeof SortDropdown>;

export const SortDropdownExample: StoryFn<typeof SortDropdown> = () => (
  <SortDropdown
    data={modelData}
    sortOptions={sortOptions}
    setModelData={(sortedData) => {
      console.log("Sorted Data:", sortedData);
    }}
    placeholder="Sort by..."
  />
);
