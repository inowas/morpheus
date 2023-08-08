import React from 'react';
import {Breadcrumb} from 'semantic-ui-react';
import {useLocation} from 'react-router-dom';
import {useNavigate} from 'simpletools/common/hooks'; // If you're using React Router
import styles from './Breadcrumb.module.less';

const BreadcrumbComponent = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const locationPath = location.pathname;
  const items = locationPath.split('/').filter(segment => '' !== segment);
  const breadcrumbItems = items.map((segment, index) => {
    const name = segment;
    const path = `/${items.slice(0, index + 1).join('/')}`;
    return {name, path};
  });

  console.log(breadcrumbItems);

  return (
    <div>
      <Breadcrumb>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.name}>
            {0 < index && <Breadcrumb.Divider icon="right angle"/>}
            <Breadcrumb.Section
              as={index === breadcrumbItems.length - 1 ? 'span' : 'a'}
              title={item.name}
              className={`${styles.breadcrumb} , `}
              onClick={(e) => {
                e.stopPropagation();
                navigateTo(item.path);
              }}
              style={{cursor: index === breadcrumbItems.length - 1 ? 'default' : 'pointer'}}
            >
              {item.name}
            </Breadcrumb.Section>
          </React.Fragment>
        ))}
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbComponent;
