import React from 'react';
import {Breadcrumb} from 'semantic-ui-react';
import {useLocation} from 'react-router-dom';
import {useNavigate} from '../../simpletools/common/hooks'; // If you're using React Router

interface BreadcrumbItem {
  text: string;
  path?: string;
  title?: string;
}

interface BreadcrumbComponentProps {
  items: BreadcrumbItem[];
}

const BreadcrumbComponent: React.FC<BreadcrumbComponentProps> = ({items}) => {
  const navigateTo = useNavigate();
  const location = useLocation();
  console.log(location.state);

  return (
    <div style={{paddingTop: '40px'}}>
      <Breadcrumb>
        <Breadcrumb.Section link={true} onClick={() => navigateTo('/tools')}>
          Tools
        </Breadcrumb.Section>
        {items.map((item) => (
          <React.Fragment key={item.path}>
            <Breadcrumb.Divider icon="right angle"/>
            <Breadcrumb.Section active={true}>{item.text}</Breadcrumb.Section>
            {/*{item.path ? (*/}
            {/*  <Breadcrumb.Section*/}
            {/*    as="a"*/}
            {/*    title={item.title}*/}
            {/*    onClick={(e) => {*/}
            {/*      e.stopPropagation();*/}
            {/*      navigateTo('/tools' + item.path);*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    {item.text}*/}
            {/*  </Breadcrumb.Section>*/}
            {/*) : (*/}
            {/*  <Breadcrumb.Section active={true}>{item.text}</Breadcrumb.Section>*/}
            {/*)}*/}
          </React.Fragment>
        ))}
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbComponent;
