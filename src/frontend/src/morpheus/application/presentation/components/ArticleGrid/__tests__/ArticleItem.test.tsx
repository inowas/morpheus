import {act, render, screen} from '@testing-library/react';

import ArticleItem from '../ArticleItem';
import React from 'react';

const article = {
  id: 1,
  title: 'title',
  image: 'image',
  description: 'description',
  toolLink: 'toolLink',
  documentationLink: 'documentationLink',
};

const navigateToToolMock = jest.fn();
const navigateToDocumentationMock = jest.fn();
const translateMock = jest.fn().mockReturnValue('translated value');

describe('Article Item Tests', () => {
  test('It renders the component', async () => {
    render(
      <ArticleItem
        article={article}
        navigateToTool={navigateToToolMock}
        navigateToDocumentation={navigateToDocumentationMock}
        translate={translateMock}
      />,
    );
    expect(screen.getByTestId('article-item')).toBeInTheDocument();
  });

  test('Executes navigateToTool', async () => {
    render(
      <ArticleItem
        article={article}
        navigateToTool={navigateToToolMock}
        navigateToDocumentation={navigateToDocumentationMock}
        translate={translateMock}
      />,
    );

    const openToolButton = screen.getByRole('button', {name: /open tool/i});
    act(() => {
      openToolButton.click();
    });

    expect(navigateToToolMock).toHaveBeenCalledTimes(1);
  });

  test('Executes navigateToDocumentation', async () => {
    render(
      <ArticleItem
        article={article}
        navigateToTool={navigateToToolMock}
        navigateToDocumentation={navigateToDocumentationMock}
        translate={translateMock}
      />,
    );

    const openDocumentationButton = screen.getByRole('button', {name: /open documentation/i});
    act(() => {
      openDocumentationButton.click();
    });

    expect(navigateToDocumentationMock).toHaveBeenCalledTimes(1);
  });

  test('Renders shortened description', async () => {

    const articleWithLongDescription = {
      ...article,
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur dolorem esse fugiat illo mollitia reprehenderit ullam vero. ' +
        'Ad alias eaque et exercitationem illo ipsa minima molestiae natus neque. Consequatur eveniet, excepturi id, iusto libero minima nostrum nulla, ' +
        'officia quasi sed soluta vitae. Enim eum facilis quisquam repellendus sunt! Ad excepturi facere nam omnis. Ad asperiores eos excepturi incidunt ipsa, ' +
        'itaque molestiae nesciunt nisi odio perspiciatis. Adipisci dignissimos fuga fugiat impedit molestias rerum sed? Aliquid at autem cupiditate deleniti ' +
        'expedita hic natus praesentium saepe velit. Cum dicta dolor, fuga fugiat id minima nulla voluptatibus! Aspernatur dolorum eius inventore molestiae nam ' +
        'nemo nihil soluta sunt veniam? Aut ea explicabo impedit nisi vel vitae voluptatum. Alias dolorem itaque maiores nesciunt quis repellendus reprehenderit ' +
        'saepe tempora ullam? Tempore, vel?',
    };

    render(
      <ArticleItem
        article={articleWithLongDescription}
        navigateToTool={navigateToToolMock}
        navigateToDocumentation={navigateToDocumentationMock}
        translate={translateMock}
      />,
    );

    const description = screen.getByTestId('article-description');
    expect(description.textContent?.length).toEqual(123);
  });

});
