import DotsMenu from './DotsMenu';
import {SemanticICONS} from 'semantic-ui-react';

interface IAction {
  text: string;
  icon?: SemanticICONS;
  onClick: () => void;
}

export default DotsMenu;
export type {IAction};
