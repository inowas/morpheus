import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import T09Container, {items} from '../T09Container';

const mockNavigateTo = jest.fn();

jest.mock('../../../application', () => ({
  useNavigate: () => mockNavigateTo,
  useTranslate: () => ({
    i18n: {
      changeLanguage: () => {
      },
    },
    translate: (key: string) => key,
    language: 'en',
  }),
}));

describe('Container Tests', () => {

  test('It renders the component', async () => {
    render(
      <T09Container/>,
    );
    expect(screen.getByTestId('t09-container')).toBeInTheDocument();
  });

  test('It renders the tool', async () => {
    render(<T09Container/>);
    items.forEach((item) => {
      const toolHeading = screen.getByRole('heading', {
        name: new RegExp(item.tool, 'i'),
      });
      const toolTitle = screen.getByText(new RegExp(`${item.tool}_title`, 'i'));
      const toolDescription = screen.getByText(new RegExp(`${item.tool}_description`, 'i'));
      expect(toolHeading).toBeInTheDocument();
      expect(toolTitle).toBeInTheDocument();
      expect(toolDescription).toBeInTheDocument();
    });
  });

  test('It shows the dimmer effect and "Select" button on hover', async () => {
    render(<T09Container/>);
    items.forEach((item) => {
      const tool = screen.getByText(`${item.tool}`);
      fireEvent.mouseEnter(tool);
      const button = screen.getByRole('button', {
        name: new RegExp(`select ${item.tool}`, 'i'),
      });
      expect(button).toBeInTheDocument();
    });
  });

  test('It removes the dimmer effect on mouse leave', async () => {
    render(<T09Container/>);

    items.forEach((item) => {
      const tool = screen.getByText(`${item.tool}`);
      fireEvent.mouseEnter(tool);
      const button = screen.getByRole('button', {
        name: new RegExp(`select ${item.tool}`, 'i'),
      });
      fireEvent.mouseLeave(tool);
      expect(button).not.toBeInTheDocument();
    });
  });

  
  test('It navigates to the correct path when a tool is selected', async () => {
    render(<T09Container/>);
    items.forEach((item) => {
      mockNavigateTo.mockClear();
      const tool = screen.getByTestId(`${item.tool}-gridcell`);
      act(() => {
        tool.click();
      });
      expect(mockNavigateTo).toHaveBeenCalledTimes(1);
      expect(mockNavigateTo).toHaveBeenCalledWith(`/tools/T09/${item.tool}`);
    });
  });

});
