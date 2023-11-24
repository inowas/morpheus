import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import ModelCard from './ModelCard';
import {IModelCard} from './types/ModelCard.type';

const model: IModelCard = {
  id: 3,
  model_description: 'Small model at NU campus',
  model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
  model_title: 'Simulation ofSUDS impact',
  model_Link: '/tools/04',
  model_map: '/tools/01',
  meta_author_avatar: '/author/EmilyBrown.jpeg',
  meta_author_name: 'Emily Brown',
  meta_link: 'https://metaLink4',
  meta_text: new Date().toLocaleDateString(),
  meta_status: true,
};

describe('ModelCard Component', () => {
  test('renders ModelCard component with provided data', () => {
    render(
      <ModelCard
        data={model}
        navigateTo={jest.fn()}
        onDeleteButtonClick={jest.fn()}
        onCopyButtonClick={jest.fn()}
      />,
    );

    expect(screen.getByTestId('model-card')).toBeInTheDocument();

    // Check if ModelCard content is rendered
    expect(screen.getByText(model.model_title)).toBeInTheDocument();
    expect(screen.getByText(model.model_description)).toBeInTheDocument();
    expect(screen.getByAltText(model.model_description)).toBeInTheDocument();
    // Add more specific checks based on rendered content
  });

  test('invokes functions correctly on button clicks', () => {
    const mockNavigateTo = jest.fn();
    const mockDeleteButtonClick = jest.fn();
    const mockCopyButtonClick = jest.fn();

    render(
      <ModelCard
        data={model}
        navigateTo={mockNavigateTo}
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
