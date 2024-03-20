// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";

import Footer from "./Footer";
import React from "react";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Footer",
  component: Footer,
} as Meta;

export const FooterExample: StoryFn<typeof Footer> = () => (
  <Footer release={"Your Release Version"} />
);
