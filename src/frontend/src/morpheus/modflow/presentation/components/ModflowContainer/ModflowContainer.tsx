import React from 'react';


interface IProps {
  children: React.ReactNode;
  headerHeight?: number;
  overflow?: 'hidden' | 'auto';
}

const ModflowContainer = ({children, headerHeight = 140, overflow = 'hidden'}: IProps) => (
  <div
    style={{
      height: '100vh',
      display: 'flex',
      overflow: overflow,
      paddingTop: headerHeight,
    }}
  >
    {children}
  </div>
);

export default ModflowContainer;
