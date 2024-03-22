// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLock, faUnlock} from '@fortawesome/free-solid-svg-icons';

import React from 'react';
import SectionTitle from 'common/components/SectionTitle';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'SectionTitle',
  component: SectionTitle,
} as Meta<typeof SectionTitle>;

export const SectionTitleExample: StoryFn<typeof SectionTitle> = () => {
  const [locked, setLocked] = React.useState<boolean>(false);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <SectionTitle
        title={'Model Geometry'}
      />
      <SectionTitle
        subTitle={'Model Geometry'}
      />
      <SectionTitle
        title={'Model Geometry'}
        faIcon={<FontAwesomeIcon icon={locked ? faLock : faUnlock}/>}
        faIconText={locked ? 'Locked' : 'Unlocked'}
        faIconOnClick={() => {
          setLocked(!locked);
        }}
      />
      <SectionTitle
        subTitle={'Model Geometry'}
        faIcon={<FontAwesomeIcon icon={locked ? faLock : faUnlock}/>}
        faIconText={locked ? 'Locked' : 'Unlocked'}
        faIconOnClick={() => {
          setLocked(!locked);
        }}
      />
      <SectionTitle
        title={'Model Geometry'}
        btnTitle={'Edit'}
        onClick={() => {
          console.log('some action');
        }}
      />
      <SectionTitle
        subTitle={'Model Geometry'}
        btnTitle={'Edit'}
        onClick={() => {
          console.log('some action');
        }}
      />
      <SectionTitle
        title={'Model Geometry'}
        btnTitle={'Edit'}
        onClick={() => {
          console.log('some action');
        }}
        faIcon={<FontAwesomeIcon icon={locked ? faLock : faUnlock}/>}
        faIconText={locked ? 'Locked' : 'Unlocked'}
        faIconOnClick={() => {
          setLocked(!locked);
        }}
      />
      <SectionTitle
        subTitle={'Model Geometry'}
        btnTitle={'Edit'}
        onClick={() => {
          console.log('some action');
        }}
        faIcon={<FontAwesomeIcon icon={locked ? faLock : faUnlock}/>}
        faIconText={locked ? 'Locked' : 'Unlocked'}
        faIconOnClick={() => {
          setLocked(!locked);
        }}
      />
    </div>
  );
};
