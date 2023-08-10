import React from 'react';
import {Breadcrumb as SemanticBreadCrumb} from 'semantic-ui-react';
import styles from './Breadcrumb.module.less';

interface IItem {
  label: string;
  link?: string;
}

interface IProps {
  items: IItem[];
  navigateTo: (path: string) => void;
}

const Breadcrumb = ({items, navigateTo}: IProps) => {

  return (
    <SemanticBreadCrumb>
      {items.map((item, idx) => (
        <React.Fragment key={item.label}>
          {0 < idx && <SemanticBreadCrumb.Divider icon="right angle"/>}
          <SemanticBreadCrumb.Section
            as={idx === items.length - 1 ? 'span' : 'a'}
            title={item.label}
            className={`${styles.breadcrumb} , `}
            onClick={(e) => {
              if (item.link === undefined) {
                return;
              }
              e.stopPropagation();
              navigateTo(item.link);
            }}
            style={{cursor: idx === items.length - 1 ? 'default' : 'pointer'}}
          >
            {item.label}
          </SemanticBreadCrumb.Section>
        </React.Fragment>
      ))}
    </SemanticBreadCrumb>
  );
};

export default Breadcrumb;
