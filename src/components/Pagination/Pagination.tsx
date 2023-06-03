import React from 'react';
import {Pagination as SemanticPagination} from 'semantic-ui-react';
import {SemanticShorthandItem} from 'semantic-ui-react/dist/commonjs/generic';
import {PaginationItemProps} from 'semantic-ui-react/dist/commonjs/addons/Pagination/PaginationItem';
import {PaginationProps} from 'semantic-ui-react/dist/commonjs/addons/Pagination/Pagination';


export interface IPaginationProps extends PaginationProps {
  'aria-label'?: string
  defaultActivePage?: number | string
  activePage?: number | string
  boundaryRange?: number | string
  disabled?: boolean
  ellipsisItem?: SemanticShorthandItem<PaginationItemProps>
  firstItem?: SemanticShorthandItem<PaginationItemProps>
  lastItem?: SemanticShorthandItem<PaginationItemProps>
  nextItem?: SemanticShorthandItem<PaginationItemProps>
  pageItem?: SemanticShorthandItem<PaginationItemProps>
  prevItem?: SemanticShorthandItem<PaginationItemProps>
  onPageChange?: (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => void
  siblingRange?: number | string
  totalPages: number | string
  style?: React.CSSProperties;
}

const Pagination: React.FC<IPaginationProps> = (props) => (
  <SemanticPagination {...props} />
);

export default Pagination;
