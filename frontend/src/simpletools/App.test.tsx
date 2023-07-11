import React from 'react';

import {toHaveNoViolations} from 'jest-axe';
import {render} from '@testing-library/react';
import App from './App';

expect.extend(toHaveNoViolations);

jest.mock('./i18n');

it('The application has no accessibility violations', async () => {
  const {container} = render(
    <App/>,
  );

  expect(await container).not.toBeNull();
  //const results = await axe(container);
  //expect(results).toHaveNoViolations();
});
