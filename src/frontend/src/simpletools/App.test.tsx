import App from './App';
import React from 'react';
import {render} from '@testing-library/react';
import {toHaveNoViolations} from 'jest-axe';

expect.extend(toHaveNoViolations);

it('The application has no accessibility violations', async () => {
  const {container} = render(
    <App/>,
  );

  expect(await container).not.toBeNull();
});
