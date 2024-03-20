// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";

import Loader from "./Loader";
import React from "react";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Loader",
  component: Loader,
} as Meta<typeof Loader>;

export const LoaderActive: StoryFn<typeof Loader> = () => (
  <Loader active={true} />
);

export const LoaderInverter: StoryFn<typeof Loader> = () => (
  <Loader active={true} inverted={true} />
);
