import React, {useState} from 'react';
import {ButtonGroup as ButtonGroupComponent} from 'semantic-ui-react';

interface IProps {
  children: React.ReactNode[]
}

const ButtonGroup = ({children}: IProps) => {

  const [selectedButton, setSelectedButton] = useState<number | null>(null);

  return (
    <div>
      <ButtonGroupComponent>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child as React.ReactElement, {
            key: index,
            onClick: () => setSelectedButton(index),
            active: selectedButton === index,
          });
        })}
      </ButtonGroupComponent>
    </div>
  );
};

export default ButtonGroup;
