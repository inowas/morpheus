// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";

import React from "react";
import Segment from "./Segment";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Segment",
  component: Segment,
} as Meta<typeof Segment>;

export const SegmentExample: StoryFn<typeof Segment> = () => (
  <Segment placeholder={true} content={"SEGMENT"} />
);
