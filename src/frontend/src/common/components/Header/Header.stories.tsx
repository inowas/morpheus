// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import Header from 'common/components/Header';
import {ILanguage} from './Navbar/LanguageSelector/types/languageSelector.type';
import React from 'react';

const navbarItems = [
  {
    name: 'home', label: 'Home', admin: false, basepath: '/', subMenu: [
      {name: 'T02', label: 'T02: Groundwater Mounding (Hantush)', admin: false, to: '/tools/T02'},
      {name: 'T04', label: 'T04: Database for GIS-based Suitability Mapping', admin: false, to: '/tools/T04'}],
  },
  {name: 'tools', label: 'Tools', admin: false, to: '/tools'},
  {name: 'modflow', label: 'Modflow', admin: false, to: '/modflow'},
  {name: 'support', label: 'Support', admin: false, to: '/support'},
  {name: 'news', label: 'News', admin: false, to: '/news'},
];

const navbarItems2 = [
  {
    name: 'home', label: 'Home', admin: false, basepath: '/', subMenu: [
      {name: 'T02', label: 'T02: Groundwater Mounding (Hantush)', admin: false, to: '/tools/T02'},
      {name: 'T04', label: 'T04: Database for GIS-based Suitability Mapping', admin: false, to: '/tools/T04'}],
  },
  {name: 'filters', label: 'Filters', admin: false, to: '/tools'},
  {name: 'documentation', label: 'Documentation', admin: false, to: '/modflow'},
];

const languageList: ILanguage[] = [
  {code: 'en-GB', label: 'English'},
];

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Header',
  component: Header,
} as Meta<typeof Header>;


export const HeaderExample: StoryFn<typeof Header> = () => (
  <div style={{margin: '-1rem'}}>
    <Header
      navbarItems={navbarItems}
      language="en-GB"
      languageList={languageList}
      onChangeLanguage={() => {
      }}
      navigateTo={() => {
      }}
      pathname={'/'}
      showSearchWrapper={true}
    />
  </div>

);

export const HeaderExampleNoSearch: StoryFn<typeof Header> = () => (
  <div style={{margin: '-1rem'}}>
    <Header
      navbarItems={navbarItems2}
      language="en-GB"
      languageList={languageList}
      onChangeLanguage={() => {
      }}
      navigateTo={() => {
      }}
      pathname={'/'}
      showSearchWrapper={false}
    />
  </div>
);

export const HeaderExampleNoCreateButton: StoryFn<typeof Header> = () => (
  <div style={{margin: '-1rem'}}>
    <Header
      navbarItems={navbarItems2}
      language="en-GB"
      languageList={languageList}
      onChangeLanguage={() => {
      }}
      navigateTo={() => {
      }}
      pathname={'/'}
      showSearchWrapper={true}
    />
  </div>
);

export const HeaderExampleNoCreateButtonNoSearch: StoryFn<typeof Header> = () => (
  <div style={{margin: '-1rem'}}>
    <Header
      navbarItems={navbarItems2}
      language="en-GB"
      languageList={languageList}
      onChangeLanguage={() => {
      }}
      navigateTo={() => {
      }}
      pathname={'/'}
      showSearchWrapper={false}
    />
  </div>
);