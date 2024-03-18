import {fireEvent, render, screen} from '@testing-library/react';

import {IProjectCard} from './types/ModelCard.type';
import ModelCard from './ModelCard';
import React from 'react';

const model: IProjectCard = {
  projectId: 3,
  description: 'Small model at NU campus',
  image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
  name: 'Simulation ofSUDS impact',
  model_Link: '/tools/04',
  model_map: '/tools/01',
  owner_avatar: '/author/EmilyBrown.jpeg',
  owner_name: 'Emily Brown',
  meta_link: 'https://metaLink4',
  last_updated_at: new Date().toLocaleDateString(),
  status_color: true,
};

describe('ModelCard Component', () => {
  test('renders ModelCard component with provided data', () => {
    render(
      <ModelCard
        data={model}
        onDeleteButtonClick={jest.fn()}
        onCopyButtonClick={jest.fn()}
      />,
    );

    expect(screen.getByTestId('model-card')).toBeInTheDocument();

    // Check if ModelCard content is rendered
    expect(screen.getByText(model.name)).toBeInTheDocument();
    expect(screen.getByText(model.description)).toBeInTheDocument();
    expect(screen.getByAltText(model.description)).toBeInTheDocument();
    // Add more specific checks based on rendered content
  });

  test('invokes functions correctly on button clicks', () => {
    const mockDeleteButtonClick = jest.fn();
    const mockCopyButtonClick = jest.fn();

    render(
      <ModelCard
        data={model}
        onDeleteButtonClick={mockDeleteButtonClick}
        onCopyButtonClick={mockCopyButtonClick}
      />,
    );

    // Simulate button clicks and verify if respective functions are called
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    expect(mockDeleteButtonClick).toHaveBeenCalled();

    const copyButton = screen.getByTestId('copy-button');
    fireEvent.click(copyButton);
    expect(mockCopyButtonClick).toHaveBeenCalled();
  });
});
