import {render, screen} from '@testing-library/react';
import {ILanguage} from './LanguageSelector/types/languageSelector.type';
import Header from './Header';
import React from 'react';
import userEvent from '@testing-library/user-event';

const languageList: ILanguage[] = [
  {code: 'en-GB', label: 'English'},
];

const mockOnChangeLanguage = jest.fn();
const mockNavigateTo = jest.fn();

const language = 'en-GB';

describe('Header Tests', () => {
  test('It renders the Header component', () => {
    render(
      <Header
        language={language}
        languageList={languageList}
        onChangeLanguage={mockOnChangeLanguage}
        navigateTo={mockNavigateTo}
      />,
    );

    expect(screen.getByTestId('test-header')).toBeInTheDocument();
    expect(screen.getByTestId('test-logo')).toBeInTheDocument();
  });

  test('It calls navigateTo when logo is clicked', async () => {
    render(
      <Header
        language={language}
        languageList={languageList}
        onChangeLanguage={mockOnChangeLanguage}
        navigateTo={mockNavigateTo}
      />,
    );

    const logo = screen.getByTestId('test-logo');
    await userEvent.click(logo);

    expect(mockNavigateTo).toHaveBeenCalledWith('/');
  });
});
