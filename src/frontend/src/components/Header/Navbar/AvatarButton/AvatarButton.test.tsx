import {render, screen} from '@testing-library/react';

import AvatarButton from './AvatarButton';
import React from 'react';

describe('AvatarButton Tests', () => {
  test('It renders the AvatarButton component', () => {
    render(
      <AvatarButton image={'https://www.gravatar.com/avatar/4d94d3e077d7b5f527ac629be4800130/?s=80'}/>,
    );

    expect(screen.getByTestId('avatar-button')).toBeInTheDocument();
  });
});
