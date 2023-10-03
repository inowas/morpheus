import React, {useState} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn, Meta} from '@storybook/react';
import Alerts from './index';
import {IAlert} from './Alert.type';
import Page from '../PageContainer/Page';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Alerts',
  component: Alerts,
} as Meta<typeof Alerts>;


export const Primary: StoryFn<typeof Alerts> = () => {

  const [alerts, setAlerts] = useState<IAlert[]>(
    [
      {
        uuid: 'ddf692c7-91fb-43e0-9b49-d3e18b588731',
        type: 'success',
        messages: ['success_message'],
        args: {items: 1},
        delayMs: 5000,
      },
      {
        uuid: 'c0660a83-8fa0-4b9b-9a70-a9b9f5de94f3',
        type: 'error',
        messages: ['error_message'],
        delayMs: 5000,
      },
    ]);

  const translate = (key: string) => key;
  return (
    <Page
      fluid={true}
      segmentStyle={{
        height: 'calc(100vh - 90px)',
        padding: 20,
      }}
      as='h1'
      header={'Itexia Page'}
    >
      Page Content
      <Alerts
        alerts={alerts}
        onClear={(id) => (setAlerts(alerts.filter(alert => alert.uuid !== id)))}
        translate={translate}
      />
    </Page>
  );
};
