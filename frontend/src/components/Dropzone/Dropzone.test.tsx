import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import {Dropzone} from '../index';

describe('LogoDropzone Tests', () => {
  test('It renders a LogoDropzone', async () => {

    const systemSettingsLogoSpecs = {
      max_file_size: 500,
      allowed_mime_types: ['image/jpeg',
        'image/png',
        'image/gif'],
    };
    const file = 'dfsdgsgdsg987';

    const systemSettings = {
      company_logo_uri: null,
    };
    const onChange = jest.fn();
    const mimeTypeErrorText = 'error_text';
    render(
      <Dropzone
        logo={systemSettings.company_logo_uri}
        onChange={onChange}
        overlayText={'choose_image'}
        deleteText={'delete_image'}
        maxFileSizeInKb={systemSettingsLogoSpecs.max_file_size}
        allowedMimetypes={systemSettingsLogoSpecs.allowed_mime_types}
        mimeTypeErrorText={mimeTypeErrorText}
        filesizeExceededErrorText={'logo_filesize_error'}
      />,
    );
    expect(screen.getByTestId('LogoDropzone')).toBeInTheDocument();
    const fileInput = screen.getByTestId('fileInput');
    expect(fileInput).toBeInTheDocument();
    fireEvent.change(fileInput, {target: {files: file}});
    expect(onChange).toHaveBeenCalled();
  });

  test('It renders a LogoDropzone', async () => {

    const systemSettingsLogoSpecs = {
      max_file_size: 5000,
      allowed_mime_types: ['image/jpeg',
        'image/png',
        'image/gif'],
    };

    const systemSettings = {
      company_logo_uri: 'lkjli87687vyug',
    };
    const onChange = jest.fn();
    const mimeTypeErrorText = 'error_text';
    render(
      <Dropzone
        logo={systemSettings.company_logo_uri}
        onChange={onChange}
        overlayText={'choose_image'}
        deleteText={'delete_image'}
        maxFileSizeInKb={systemSettingsLogoSpecs.max_file_size}
        allowedMimetypes={systemSettingsLogoSpecs.allowed_mime_types}
        mimeTypeErrorText={mimeTypeErrorText}
        filesizeExceededErrorText={'logo_filesize_error'}
      />,
    );
    const deleteText = screen.getByTestId('delete_text');
    expect(deleteText).toBeInTheDocument();
    fireEvent.click(deleteText);
    expect(onChange).toHaveBeenCalled();
  });
});
