import {Accordion as SemanticAccordion, AccordionContent, AccordionProps, AccordionTitle} from 'semantic-ui-react';
import React, {ReactNode, useState} from 'react';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({title, children, active, onClick}) => {
  return (
    <>
      <AccordionTitle active={active} onClick={onClick}>
        {title}
      </AccordionTitle>
      <AccordionContent active={active}>
        {children}
      </AccordionContent>
    </>
  );
};

const AccordionRef: React.FC<AccordionProps> = ({children, ...props}) => {

  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const handleItemClick = (index: number) => {
    const newIndices = [...activeIndices];

    if (newIndices.includes(index)) {
      // Item is already open, so close it
      const indexToRemove = newIndices.indexOf(index);
      newIndices.splice(indexToRemove, 1);
    } else {
      // Item is closed, so open it
      newIndices.push(index);
    }

    setActiveIndices(newIndices);
  };

  return (
    <SemanticAccordion {...props}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as React.ReactElement<AccordionItemProps>, {
          active: activeIndices.includes(index),
          onClick: () => handleItemClick(index),
        }),
      )}
    </SemanticAccordion>
  );
};

export {AccordionRef, AccordionItem};
