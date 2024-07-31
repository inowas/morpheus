import React from 'react';
import {Menu as SemanticMenu, MenuItem as SemanticMenuItem, MenuItemProps as SemanticMenuItemProps, MenuProps as SemanticMenuProps} from 'semantic-ui-react';

// Define the props for the Menu component
export interface IMenuProps extends Omit<SemanticMenuProps, 'items'> {
  activeIndex?: number | string;
  as?: React.ElementType;
  attached?: boolean | 'top' | 'bottom';
  borderless?: boolean;
  children?: React.ReactNode;
  className?: string;
  color?: 'red' | 'orange' | 'yellow' | 'olive' | 'green' | 'teal' | 'blue' | 'violet' | 'purple' | 'pink' | 'brown' | 'grey' | 'black';
  compact?: boolean;
  defaultActiveIndex?: number | string;
  fixed?: 'left' | 'right' | 'bottom' | 'top';
  floated?: boolean | 'right';
  fluid?: boolean;
  icon?: boolean | 'labeled';
  inverted?: boolean;
  items?: Array<SemanticMenuItemProps> | SemanticMenuItemProps[];
  onItemClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, data: SemanticMenuItemProps) => void;
  pagination?: boolean;
  pointing?: boolean;
  secondary?: boolean;
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'huge' | 'massive';
  stackable?: boolean;
  tabular?: boolean | 'right';
  text?: boolean;
  vertical?: boolean;
  widths?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | 'one' | 'two' | 'three' | 'four' | 'five' | 'six' | 'seven' | 'eight' | 'nine' | 'ten' | 'eleven' | 'twelve' | 'thirteen' | 'fourteen' | 'fifteen' | 'sixteen';
}

// Create the Menu component
const Menu: React.FC<IMenuProps> = ({items, onItemClick, ...props}) => {
  if (items) {
    return (
      <SemanticMenu {...props}>
        {items.map((item, index) => (
          <SemanticMenuItem
            key={item.key || index}
            {...item}
            onClick={(event, data) => onItemClick?.(event, data)}
          />
        ))}
      </SemanticMenu>
    );
  }

  return <SemanticMenu {...props} />;
};

// Define the props for the MenuItem component
export interface IMenuItemProps extends SemanticMenuItemProps {
  active?: boolean;
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  color?: 'red' | 'orange' | 'yellow' | 'olive' | 'green' | 'teal' | 'blue' | 'violet' | 'purple' | 'pink' | 'brown' | 'grey' | 'black';
  content?: React.ReactNode;
  disabled?: boolean;
  fitted?: boolean | 'horizontally' | 'vertically';
  header?: boolean;
  icon?: boolean | React.ReactNode;
  index?: number;
  link?: boolean;
  name?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, data: SemanticMenuItemProps) => void;
  position?: 'right';
}

// Create the MenuItem component
const MenuItem: React.FC<IMenuItemProps> = (props) => (
  <SemanticMenuItem {...props} />
);

export {MenuItem};
export default Menu;
