import React, {ReactNode} from 'react';

interface IProps {
  children: ReactNode;
}

const ContentContainer = ({children}: IProps) => (
  <main>
    {children}
  </main>
);

export default ContentContainer;
