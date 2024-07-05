import React from 'react';

interface IProps {
  children: React.ReactNode;
}

const PackageWrapper = ({children}: IProps) => (
  <div style={{
    boxShadow: '0 1px 2px 0 #eee, 0 0 0 1px #eee',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
  }}
  >
    {children}
  </div>
);
export default PackageWrapper;
