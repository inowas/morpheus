import {SemanticICONS} from 'semantic-ui-react';
import DotsMenu from './DotsMenu';

export interface IAction {
  text: string;
  icon?: SemanticICONS;
  onClick: () => void;
}

export default DotsMenu;
