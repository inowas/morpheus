import React, {useEffect} from 'react';
import {Accordion, AccordionContent, AccordionTitle, Divider, Header, Segment} from 'semantic-ui-react';

import styles from './Section.module.less';

interface IProps {
  title: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  open?: boolean;
  collapsable?: boolean;
  children?: React.ReactNode;
}

const Section = ({title, as, open: openProp = true, children, collapsable = false}: IProps) => {

  const [open, setOpen] = React.useState<boolean>(openProp);

  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

  if (true == collapsable) {
    return (
      <Segment className={styles.wrapper}>
        <Accordion exclusive={true}>
          <AccordionTitle
            className={styles.title + ' ' + (open ? '' : styles.hidden)}
            as={as || 'h2'} active={open}
            onClick={() => setOpen(!open)}
          >
            {title}
          </AccordionTitle>
          <AccordionContent title={title} active={open}>
            {children}
          </AccordionContent>
        </Accordion>
      </Segment>
    );
  }

  return (
    <Segment className={styles.wrapper}>
      <Header
        className={styles.title}
        as={as || 'h2'}
      >
        <span className={styles.title}>
          {title}
        </span>
      </Header>
      <Divider/>
      {children}
    </Segment>
  );
};

export default Section;
