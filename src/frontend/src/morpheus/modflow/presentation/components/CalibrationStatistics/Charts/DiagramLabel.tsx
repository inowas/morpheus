import React, {ReactNode} from 'react';

interface IDiagramLabelProps {
  children: ReactNode;
}

const DiagramLabel = ({children}: IDiagramLabelProps) => (
  <div style={{position: 'absolute', bottom: 100, right: 80}}>
    <div style={{color: 'red', padding: 20, border: '1px solid red', backgroundColor: 'white'}}>
      {children}
    </div>
  </div>
);

export default DiagramLabel;
