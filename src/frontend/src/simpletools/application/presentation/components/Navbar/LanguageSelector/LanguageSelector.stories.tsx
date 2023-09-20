import React, {useState} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Page from '../../../../../../components/PageContainer/Page';
import LanguageSelector from './LanguageSelector';
import {ILanguage} from './types/languageSelector.type';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'LanguageSelector',
  component: LanguageSelector,
} as ComponentMeta<typeof LanguageSelector>;


export const Primary: ComponentStory<typeof LanguageSelector> = () => {

  const [selectedLanguage, setSelectedLanguage] = useState<ILanguage['code']>('en-GB');

  return (
    <Page
      fluid={true}
      segmentStyle={{
        height: 'calc(100vh - 90px)',
        padding: 20,
      }}
      as="h1"
      header={'Language Selector Page Example'}
    >
      <div style={{float: 'right'}}>
        <LanguageSelector
          language={selectedLanguage}
          languageList={[
            {
              code: 'en-GB',
              label: 'English',
            },
            {
              code: 'de-DE',
              label: 'German',
            },
          ]}
          onChangeLanguage={(language: ILanguage['code']) => setSelectedLanguage(language)}
        />
      </div>
    </Page>
  );
};
