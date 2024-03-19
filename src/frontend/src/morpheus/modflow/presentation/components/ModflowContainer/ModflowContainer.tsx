import React from 'react';


interface IProps {
  children: React.ReactNode;
  headerHeight?: number;

}

const ModflowContainer = ({children, headerHeight = 140}: IProps) => (
  <div
    style={{
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
      paddingTop: headerHeight,
    }}
  >
    {children}
  </div>
);

export default ModflowContainer;
