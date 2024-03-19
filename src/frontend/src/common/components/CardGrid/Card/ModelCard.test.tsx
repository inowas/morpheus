import {fireEvent, render, screen} from '@testing-library/react';

import ModelCard, {ICard} from './ModelCard';
import React from 'react';

const model: ICard = {
  key: 3,
  description: 'Small model at NU campus',
  image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
  title: 'Simulation ofSUDS impact',
  author: 'Emily Brown',
  date_time: new Date().toLocaleDateString(),
  status: 'green',
};

describe('ModelCard Component', () => {
  test('renders ModelCard component with provided data', () => {
    render(
      <ModelCard
        key={model.key}
        title={model.title}
        description={model.description}
        image={model.image}
        author={model.author}
        date_time={model.date_time}
        status={model.status}
        onViewClick={jest.fn()}
        onCopyClick={jest.fn()}
        onDeleteClick={jest.fn()}
      />,
    );

    expect(screen.getByTestId('model-card')).toBeInTheDocument();

    // Check if ModelCard content is rendered
    expect(screen.getByText(model.title)).toBeInTheDocument();
    expect(screen.getByText(model.description)).toBeInTheDocument();
    expect(screen.getByAltText(model.description)).toBeInTheDocument();
    // Add more specific checks based on rendered content
  });

  test('invokes functions correctly on button clicks', () => {
    const mockCopyButtonClick = jest.fn();
    const mockDeleteButtonClick = jest.fn();

    render(
      <ModelCard
        key={model.key}
        title={model.title}
        description={model.description}
        image={model.image}
        author={model.author}
        date_time={model.date_time}
        status={model.status}
        onViewClick={jest.fn()}
        onCopyClick={mockCopyButtonClick}
        onDeleteClick={mockDeleteButtonClick}
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
