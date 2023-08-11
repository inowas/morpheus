// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import {Segment} from 'semantic-ui-react';
import {Dropzone} from '../index';
import React, {useState} from 'react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Dropzone',
  component: Dropzone,

} as Meta<typeof Dropzone>;


export const Default: StoryFn<typeof Dropzone> = () => {
  const systemSettingsLogoSpecs = {
    max_file_size: 500,
    allowed_mime_types: ['image/jpeg',
      'image/png',
      'image/gif'],
  };

  const systemSettings = {
    company_logo_uri: null,
  };
  const [settings, setSettings] = useState(systemSettings);

  const handleChange = (fieldKey: string) => (value: any) => setSettings((prev) => ({...prev, [fieldKey]: value}));


  return (
    <Segment
      raised={true}
      style={{
        paddingLeft: 250,
        paddingBottom: 450,
      }}
    >
      <div>
        <div style={{marginBottom: 5}}>Company Logo</div>
        <Dropzone
          logo={settings.company_logo_uri}
          onChange={handleChange('company_logo_uri')}
          overlayText={'choose_image'}
          maxFileSizeInKb={systemSettingsLogoSpecs.max_file_size}
          allowedMimetypes={systemSettingsLogoSpecs.allowed_mime_types}
          mimeTypeErrorText={'logo_mimetype_error'}
          filesizeExceededErrorText={'logo_filesize_error'}
          deleteText={'delete_logo'}
        />
      </div>
    </Segment>
  );
};
