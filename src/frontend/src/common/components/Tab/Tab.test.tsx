import {render, screen} from '@testing-library/react';

import React from 'react';
import Tab from './Tab';
import userEvent from '@testing-library/user-event';

describe('Tab Component Tests', () => {
  test('It renders a button', async () => {
    render(
      <Tab data-testid={'test-tab'}/>,
    );
    expect(screen.getByTestId('test-tab')).toBeInTheDocument();
  });

  test('It renders the Tab component with custom className', () => {
    render(
      <Tab data-testid={'test-tab'} className="custom-tab"/>,
    );
    expect(screen.getByTestId('test-tab')).toHaveClass('custom-tab');
  });

  test('It renders the Tab component with custom style', () => {
    render(
      <Tab data-testid={'test-tab'} style={{color: 'red'}}/>,
    );

    expect(screen.getByTestId('test-tab')).toHaveStyle({color: 'red'});
  });

  test('It renders the Tab component with a custom variant', () => {
    render(
      <Tab data-testid={'test-tab'} variant="primary"/>,
    );

    expect(screen.getByTestId('test-tab')).toHaveAttribute('data-variant', 'primary');
  });

  test('It renders as a title tab when title prop is true', () => {
    render(
      <Tab data-testid={'test-tab'} title={true}/>,
    );

    expect(screen.getByTestId('test-tab')).toHaveClass('first-item-title');
  });

  test('It triggers onTabChange when clicked', async () => {
    const onTabChangeMock = jest.fn();

    render(
      <Tab data-testid={'test-tab'} onTabChange={onTabChangeMock}/>,
    );

    await userEvent.click(screen.getByTestId('test-tab'));
    expect(onTabChangeMock).toHaveBeenCalled();
  });
});

