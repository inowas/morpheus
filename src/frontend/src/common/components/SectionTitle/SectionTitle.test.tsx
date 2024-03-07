import {render, screen} from '@testing-library/react';

import React from 'react';
import SectionTitle from '../SectionTitle';

const title = 'Some title';
describe('SectionTitle Tests', () => {
  test('It renders the Section Title component', () => {
    render(
      <SectionTitle
        title={title}
      />,
    );

    expect(screen.getByTestId('section-title')).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
  });
});

