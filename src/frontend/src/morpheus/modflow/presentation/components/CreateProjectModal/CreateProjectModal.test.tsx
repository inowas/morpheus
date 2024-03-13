import {render, screen} from '@testing-library/react';

import CreateProjectModal from './CreateProjectModal';
import React from 'react';

describe('CreateProjectModal Tests', () => {
  test('It renders the component', async () => {
    render(<CreateProjectModal isOpen={true}/>);
    expect(screen.getByTestId('create-project-modal')).toBeInTheDocument();
  });
});
