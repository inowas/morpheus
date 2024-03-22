// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";

import Loading from "./Loading";
import React from "react";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Loading",
  component: Loading,
} as Meta<typeof Loading>;

export const LoadingExample: StoryFn<typeof Loading> = () => <Loading />;
