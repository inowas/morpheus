import React from 'react';
import {render, screen} from '@testing-library/react';
import ArticleGrid from '../ModelGrid';

const articles = [{
  id: 1,
  title: 'title',
  image: 'image',
  description: 'description',
  toolLink: 'toolLink',
  documentationLink: 'documentationLink',
},
{
  id: 2,
  title: 'title2',
  image: 'image2',
  description: 'description2',
  toolLink: 'toolLink2',
  documentationLink: 'documentationLink2',
}];

describe('Article Grid Tests', () => {

  test('It renders the component', async () => {
    render(
      <ArticleGrid
        articles={articles}
        navigateTo={jest.fn()}
        translate={jest.fn()}
      />,
    );
    expect(screen.getByTestId('article-grid')).toBeInTheDocument();
  });

  test('Find all items in Grid', async () => {
    render(
      <ArticleGrid
        articles={articles}
        navigateTo={jest.fn()}
        translate={jest.fn()}
      />,
    );

    expect(screen.getByTestId('article-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('article-item-2')).toBeInTheDocument();
  });
});
