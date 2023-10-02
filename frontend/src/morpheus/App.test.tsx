import React from 'react';

import {toHaveNoViolations} from 'jest-axe';
import {render} from '@testing-library/react';
import App from './App';

expect.extend(toHaveNoViolations);

it('The application has no accessibility violations', async () => {
  const {container} = render(
    <App/>,
  );

  expect(await container).not.toBeNull();
});
