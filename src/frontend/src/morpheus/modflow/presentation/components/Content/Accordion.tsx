import React, {ReactElement, useState} from 'react';
import {Accordion as SemanticUIAccordion, AccordionContent as SemanticUIAccordionContent, AccordionTitle as SemanticUIAccordionTitle} from 'semantic-ui-react';

interface IAccordionContent {
  active?: boolean;
  onClick?: () => void;
  title: string;
  children?: React.ReactNode;
}

const AccordionContent = ({active, children, title, onClick}: IAccordionContent) => (
  <>
    <SemanticUIAccordionTitle active={active} onClick={onClick}>
      {title}
    </SemanticUIAccordionTitle>
    <SemanticUIAccordionContent active={active}>
      {children}
    </SemanticUIAccordionContent>
  </>
);

interface IAccordion {
  exclusive?: boolean;
  defaultActiveIndex?: number[];
  children?: ReactElement<IAccordionContent>[] | ReactElement<IAccordionContent>;
}

const Accordion: React.FC<IAccordion> = ({children, exclusive, defaultActiveIndex}) => {
  const [activeIndex, setActiveIndex] = useState<number[]>(defaultActiveIndex || []);

  if (undefined === children)
    return null;

  if (!Array.isArray(children)) {
    children = [children];
  }

  return (
    <SemanticUIAccordion exclusive={exclusive}>
      {children.map((child, key) => (
        <AccordionContent
          key={key}
          active={activeIndex.includes(key)}
          onClick={() => setActiveIndex(activeIndex.includes(key) ? activeIndex.filter((i) => i !== key) : [...activeIndex, key])}
          title={child.props.title}
        >
          {child.props.children}
        </AccordionContent>
      ))}
    </SemanticUIAccordion>
  );
};

export {Accordion, AccordionContent};
export type {IAccordion, IAccordionContent};
