import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

export interface IMenuItem {
  icon: IconDefinition;
  description: string;
  title?: boolean;
  active: boolean;
  disabled?: boolean;
}
