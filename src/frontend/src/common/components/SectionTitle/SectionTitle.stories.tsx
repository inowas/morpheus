// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import React from 'react';
import SectionTitle from 'common/components/SectionTitle';
import LockButton from 'common/components/LockButton/LockButton';
import {Button} from '../index';

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
        secondary={true}
        title={<><span>10</span> Model Geometry</>}
      />
      <SectionTitle
        title={'Model Geometry'}
        as={'h1'}
      />
      <SectionTitle
        title={'Model Geometry'}
        as={'h2'}
      />
      <SectionTitle
        as={'h1'}
        title={'Model Geometry'}
      >
        <LockButton
          title={locked ? 'Locked' : 'Unlocked'}
          locked={locked}
          disabled={false}
          onClick={() => setLocked(!locked)}
        />
      </SectionTitle>
      <SectionTitle
        title={'Model Geometry'}
        as={'h2'}
      >
        <LockButton
          title={locked ? 'Locked' : 'Unlocked'}
          locked={locked}
          disabled={false}
          onClick={() => setLocked(!locked)}
        />
      </SectionTitle>
      <SectionTitle
        title={'Model Geometry'}
        as={'h3'}
      >
        <Button
          disabled={false}
          primary={true}
          size={'small'}
          onClick={() => console.log('some action')}
        >
          Edit
        </Button>
      </SectionTitle>
      <SectionTitle
        title={'Model Geometry'}
        as={'h2'}
      >
        <Button
          disabled={true}
          primary={true}
          size={'small'}
          onClick={() => console.log('some action')}
        >
          Edit
        </Button>
      </SectionTitle>
      <SectionTitle
        title={'Model Geometry'}
        as={'h1'}
      >
        <LockButton
          title={locked ? 'Locked' : 'Unlocked'}
          locked={locked}
          onClick={() => setLocked(!locked)}
        />
        <Button
          primary={true}
          size={'small'}
          onClick={() => console.log('some action')}
        >
          Save
        </Button>
      </SectionTitle>
      <SectionTitle
        title={'Model Geometry'}
        as={'h2'}
      >
        <LockButton
          title={locked ? 'Locked' : 'Unlocked'}
          locked={locked}
          onClick={() => setLocked(!locked)}
        />
        <Button
          primary={true}
          size={'small'}
          onClick={() => console.log('some action')}
        >
          Save
        </Button>
      </SectionTitle>
    </div>
  );
};
