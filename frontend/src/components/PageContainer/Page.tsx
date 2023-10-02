import React from 'react';
import {Container as SemanticContainer, Divider as SemanticDivider, Header as SemanticHeader, Segment as SemanticSegment} from 'semantic-ui-react';

export type IContainerWithSegmentProps = {
  children?: React.ReactNode;
  fluid?: boolean;
  style?: React.CSSProperties;
  segmentStyle?: React.CSSProperties;
  as?: string;
  header?: string | React.ReactNode;
  loading?: boolean;
  [key: string]: any;
};

const Page: React.FC<IContainerWithSegmentProps> = (props) => {
  const {children, fluid, style, segmentStyle, as, header, loading, ...rest} = props;
  return (
    <SemanticContainer
      style={style}
      fluid={fluid}
      {...rest}
    >
      <SemanticSegment style={segmentStyle || {}} loading={loading || false}>
        <SemanticHeader as={as}>{header}</SemanticHeader>
        <SemanticDivider/>
        {children}
      </SemanticSegment>
    </SemanticContainer>
  );
};

export default Page;
