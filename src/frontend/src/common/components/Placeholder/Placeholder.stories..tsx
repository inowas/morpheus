// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";

import Placeholder from "./Placeholder";
import React from "react";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Placeholder",
  component: Placeholder,
} as Meta<typeof Placeholder>;

export const PlaceholderExample: StoryFn<typeof Placeholder> = () => (
  <Placeholder header={"Header"} message={"Placeholder message goes here!"} />
);
