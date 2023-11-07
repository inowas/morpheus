import React from 'react';
import {render, screen} from '@testing-library/react';
import NavTop from './NavTop';
import {ILanguage} from '../LanguageSelector/types/languageSelector.type';
import userEvent from '@testing-library/user-event';

const languageList: ILanguage[] = [
  {code: 'en-GB', label: 'English'},
];

const mockOnChangeLanguage = jest.fn();
const mockNavigateTo = jest.fn();

const language = 'en-GB';

describe('NavTop Tests', () => {
  test('It renders the NavTop component', () => {
    render(
      <NavTop
        language={language}
        languageList={languageList}
        onChangeLanguage={mockOnChangeLanguage}
        navigateTo={mockNavigateTo}
      />,
    );

    expect(screen.getByTestId('test-navtop')).toBeInTheDocument();
    expect(screen.getByTestId('test-logo')).toBeInTheDocument();
  });

  test('It calls navigateTo when logo is clicked', async () => {
    render(
      <NavTop
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
