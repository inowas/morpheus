import App from './App';
import React from 'react';
import {render} from '@testing-library/react';
import {toHaveNoViolations} from 'jest-axe';
import {store} from './store';
import {Provider} from 'react-redux';

expect.extend(toHaveNoViolations);

it('The application has no accessibility violations', async () => {
  const {container} = render(
    <Provider store={store}>
      <App/>,
    </Provider>,
  );

  expect(await container).not.toBeNull();
});
