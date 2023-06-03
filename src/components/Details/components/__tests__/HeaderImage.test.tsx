import React from 'react';
import {render, screen} from '@testing-library/react';
import HeaderImage from '../HeaderImage';

describe('HeaderImage component', () => {
  test('renders Title in HeaderImage', () => {
    const title = `Title_${Math.random()}`;

    render(<HeaderImage text={title}/>);
    expect(screen.getByTestId('title')).toHaveTextContent(title);
  });

  test('renders undefined Title in HeaderImage as empty string', () => {
    render(<HeaderImage/>);
    expect(screen.getByTestId('title')).toHaveTextContent('');
  });

  test('renders default image when url not provided', () => {
    render(<HeaderImage text="title"/>);
    expect(screen.getByTestId('defaultImage')).toBeInTheDocument();
  });

  test('renders a link and the image when url provided', () => {
    const imageUrl = 'https://img.com';
    render(<HeaderImage
      text="title"
      imageUrl={imageUrl}
    />);

    expect(screen.getByRole('img')).toHaveAttribute('src', imageUrl);
  });
});
