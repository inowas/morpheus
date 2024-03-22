// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";

import Error from "./Error";
import React from "react";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Loading",
  component: Error,
} as Meta<typeof Error>;

export const ErrorExample: StoryFn<typeof Error> = () => <Error />;
