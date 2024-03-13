import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import React from 'react';

export interface IMenuItem {
  icon: IconDefinition;
  description: string;
  title?: boolean;
  active: boolean;
  disabled?: boolean;
}


export interface ISidebarMenuItem {
  icon: React.ReactNode;
  name: string;
  isActive: boolean;
  isDisabled?: boolean;
  isTitle: boolean;
  slug: string;
  onClick?: () => void;
  component?: React.ReactNode;
}
