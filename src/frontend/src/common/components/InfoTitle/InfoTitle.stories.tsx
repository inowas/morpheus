// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";

import InfoTitle from "common/components/InfoTitle";
import React from "react";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "InfoTitle",
  component: InfoTitle,
} as Meta<typeof InfoTitle>;

export const InfoTitleExample: StoryFn<typeof InfoTitle> = () => {
  return (
    <>
      <InfoTitle
        title="Upload shapefile"
        description="Shapefile description"
        actionText="Add on map"
        actionDescription="Action description"
        onAction={() => {
          console.log("Add on map action");
        }}
      />
      <InfoTitle title="Upload raster" description="raster description" />
    </>
  );
};

export const InfoTitleNoDescriptionExample: StoryFn<typeof InfoTitle> = () => {
  return (
    <>
      <InfoTitle
        title="Upload shapefile"
        actionText="Add on map"
        onAction={() => {
          console.log("Add on map action");
        }}
      />
      <InfoTitle title="Upload raster" />
    </>
  );
};
