// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import Button from './Button';
import React from 'react';
import ButtonGroup from './ButtonGroup';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
} as Meta<typeof Button>;

const buttonWrapper: React.CSSProperties = {
  width: 'calc(100% + 20px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const buttonCard: React.CSSProperties = {
  width: 'calc(100% / 3 - 20px)',
  border: '1px solid #8494B2',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '20px',
  marginBottom: '20px',
  padding: '20px',
};

export const AllButtons: StoryFn<typeof Button> = () => {
  return (
    <div style={buttonWrapper}>
      <div style={buttonCard}>
        <Button primary={true}>Button Large</Button>
        <br/>
        <code>
          padding: 10px;
          <br/>
          background-color: #009FE3;
          <br/>
          color: #FFFFFF;
          <br/>
          font-family: "Open Sans", sans-serif;
          <br/>
          font-size: 13.5px;
          <br/>
          font-weight: 400;
          <br/>
          line-height: 1.5;
          <br/>
          text-transform: uppercase;
          <br/>
          <br/>
          :hover
          <br/>
          background-color: #6C84A6;
          <br/>
          text-decoration: underline;
          <br/>
        </code>
      </div>
      <div style={buttonCard}>
        <Button secondary={true}>Button Large</Button>
        <br/>
        <code>
          padding: 10px;
          <br/>
          background-color: #DD2727;
          <br/>
          color: #FFFFFF;
          <br/>
          font-family: "Open Sans", sans-serif;
          <br/>
          font-size: 13.5px;
          <br/>
          font-weight: 400;
          <br/>
          line-height: 1.5;
          <br/>
          text-transform: uppercase;
          <br/>
          <br/>
          :hover
          <br/>
          background-color: #6C84A6;
          <br/>
          text-decoration: underline;
          <br/>
        </code>
      </div>
      <div style={buttonCard}>
        <Button>Button Large</Button>
        <br/>
        <code>
          padding: 10px;
          <br/>
          background-color: #8494B2;
          <br/>
          color: #FFFFFF;
          <br/>
          font-family: "Open Sans", sans-serif;
          <br/>
          font-size: 13.5px;
          <br/>
          font-weight: 400;
          <br/>
          line-height: 1.5;
          <br/>
          text-transform: uppercase;
          <br/>
          <br/>
          :hover
          <br/>
          background-color: #6C84A6;
          <br/>
          text-decoration: underline;
          <br/>
        </code>
      </div>
      <div style={buttonCard}>
        <Button primary={true} size={'small'}>
          Button Small
        </Button>
        <br/>
        <code>
          padding: 10px;
          <br/>
          background-color: #009FE3;
          <br/>
          color: #FFFFFF;
          <br/>
          font-family: "Open Sans", sans-serif;
          <br/>
          font-size: 12px;
          <br/>
          font-weight: 400;
          <br/>
          line-height: 1.5;
          <br/>
          <br/>
          :hover
          <br/>
          background-color: #6C84A6;
          <br/>
          text-decoration: underline;
          <br/>
        </code>
      </div>
      <div style={buttonCard}>
        <Button secondary={true} size={'small'}>
          Button Small
        </Button>
        <br/>
        <code>
          padding: 10px;
          <br/>
          background-color: #DD2727;
          <br/>
          color: #FFFFFF;
          <br/>
          font-family: "Open Sans", sans-serif;
          <br/>
          font-size: 12px;
          <br/>
          font-weight: 400;
          <br/>
          line-height: 1.5;
          <br/>
          <br/>
          :hover
          <br/>
          background-color: #6C84A6;
          <br/>
          text-decoration: underline;
          <br/>
        </code>
      </div>
      <div style={buttonCard}>
        <Button size={'small'}>Button Small</Button>
        <br/>
        <code>
          padding: 10px;
          <br/>
          background-color: #8494B2;
          <br/>
          color: #FFFFFF;
          <br/>
          font-family: "Open Sans", sans-serif;
          <br/>
          font-size: 12px;
          <br/>
          font-weight: 400;
          <br/>
          line-height: 1.5;
          <br/>
          <br/>
          :hover
          <br/>
          background-color: #6C84A6;
          <br/>
          text-decoration: underline;
          <br/>
        </code>
      </div>
      <div style={buttonCard}>
        <Button primary={true} size={'tiny'}>
          Button Tiny
        </Button>
        <br/>
        <code>
          padding: 4px 10px;
          <br/>
          border-radius: 0;
          <br/>
          min-width: 110px;
          <br/>
          text-transform: none;
          <br/>
          background-color: #009FE3;
          <br/>
          color: #FFFFFF;
          <br/>
          font-family: "Open Sans", sans-serif;
          <br/>
          font-size: 12px;
          <br/>
          font-weight: 400;
          <br/>
          line-height: 1.5;
          <br/>
          <br/>
          :hover
          <br/>
          background-color: #6C84A6;
          <br/>
          text-decoration: underline;
          <br/>
        </code>
      </div>
      <div style={buttonCard}>
        <Button secondary={true} size={'tiny'}>
          Button tiny
        </Button>
        <br/>
        <code>
          padding: 4px 10px;
          <br/>
          border-radius: 0;
          <br/>
          min-width: 110px;
          <br/>
          text-transform: none;
          <br/>
          background-color: #DD2727;
          <br/>
          color: #FFFFFF;
          <br/>
          font-family: "Open Sans", sans-serif;
          <br/>
          font-size: 12px;
          <br/>
          font-weight: 400;
          <br/>
          line-height: 1.5;
          <br/>
          <br/>
          :hover
          <br/>
          background-color: #6C84A6;
          <br/>
          text-decoration: underline;
          <br/>
        </code>
      </div>
      <div style={buttonCard}>
        <Button size={'tiny'}>Button tiny</Button>
        <br/>
        <code>
          padding: 4px 10px;
          <br/>
          border-radius: 0;
          <br/>
          min-width: 110px;
          <br/>
          text-transform: none;
          <br/>
          background-color: #8494B2;
          <br/>
          color: #FFFFFF;
          <br/>
          font-family: "Open Sans", sans-serif;
          <br/>
          font-size: 12px;
          <br/>
          font-weight: 400;
          <br/>
          line-height: 1.5;
          <br/>
          <br/>
          :hover
          <br/>
          background-color: #6C84A6;
          <br/>
          text-decoration: underline;
          <br/>
        </code>
      </div>
    </div>
  );
};
export const Primary: StoryFn<typeof Button> = () => (
  <Button primary={true}>Button</Button>
);
export const Secondary: StoryFn<typeof Button> = () => (
  <Button secondary={true}>Button</Button>
);
export const Disabled: StoryFn<typeof Button> = () => (
  <Button disabled={true}>Button</Button>
);
export const Loading: StoryFn<typeof Button> = () => (
  <Button loading={true}>Button</Button>
);
export const LoadingPrimary: StoryFn<typeof Button> = () => (
  <Button loading={true} primary={true}>
    Button
  </Button>
);
export const LoadingSecondary: StoryFn<typeof Button> = () => (
  <Button loading={true} secondary={true}>
    Button
  </Button>
);
export const LoadingDisabled: StoryFn<typeof Button> = () => (
  <Button loading={true} disabled={true}>
    Button
  </Button>
);

export const ButtonGroupThreeButtons: StoryFn<typeof Button> = () => {
  return (
    <ButtonGroup>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </ButtonGroup>
  );
};
