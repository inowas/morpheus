import React from 'react';
import {render, screen} from '@testing-library/react';
import T08Container from './T08Container';

jest.mock('../../application', () => ({
  // useCalculateMounding: () => ({
  //   calculateHi: jest.fn().mockReturnValue(0.01),
  //   calculateHMax: jest.fn().mockReturnValue(0.01),
  // }),
  //TODO => ERROR: useNavigate() may be used only in the context of a <Router> component.
  useNavigate: () => () => {
    return;
  },
  useTranslate: () => ({
    i18n: {
      changeLanguage: () => {
      },
    },
    translate: (key: string) => key,
    language: 'en',
  }),
}));

describe('Settings Tests', () => {
  test('It renders the component', async () => {
    render(
      <T08Container/>,
    );
    //TODO add data-testid="t02-container" to container
    expect(screen.getByTestId('t08-container')).toBeInTheDocument();
  });
});
