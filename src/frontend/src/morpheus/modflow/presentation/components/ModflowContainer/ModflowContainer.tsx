import React from 'react';


interface IProps {
  children: React.ReactNode;
  headerHeight?: number;

}

const ModflowContainer = ({children, headerHeight = 0}: IProps) => (
  <div
    style={{
      height: `calc(100vh - ${headerHeight}px)`,
      display: 'flex',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

export default ModflowContainer;
