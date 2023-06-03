import React from 'react';
import {render, screen} from '@testing-library/react';
import Form from './index';

describe('From Tests', () => {
  test('It renders a form input', async () => {
    render(
      <Form.Form>
        <Form.Input
          label={'input label'}
          data-testid="input"
          value={''}
        />
      </Form.Form>,
    );

    expect(screen.getByTestId('input')).toBeInTheDocument();
  });


  test('It renders a form dropdown', async () => {
    const dropdownOptions = [{
      key: '9kkuykbwersd',
      value: '9kkuykbwersd',
      text: 'Option1',
    },
    {
      key: '9kkuykbwsd',
      value: '9kkuykersd',
      text: 'Option2',
    },
    {
      key: '9kkuyksd',
      value: '9kkkersd',
      text: 'Option3',
    }];
    render(
      <Form.Dropdown
        options={dropdownOptions}
        data-testid="dropdown"
      />,
    );

    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
  });

  test('It renders a form input radio', async () => {
    render(
      <Form.Radio
        label={'input radio'}
        data-testid="radio"
      />,
    );

    expect(screen.getByTestId('radio')).toBeInTheDocument();
  });


  test('It renders a form group', async () => {
    render(
      <Form.Form>
        <Form.Group
          data-testid="input"
        />
      </Form.Form>,
    );

    expect(screen.getByTestId('input')).toBeInTheDocument();
  });
});
