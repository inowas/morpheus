import React, {useState} from 'react';
import {Menu} from 'semantic-ui-react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faBarsStaggered,
  faBorderAll,
  faChartLine,
  faChartSimple,
  faCircle,
  faClock,
  faCompress,
  faDownload,
  faFlag,
  faFolder,
  faImage,
  faLayerGroup,
  faLocationCrosshairs,
  faMap,
  faNoteSticky,
  faPenToSquare,
  faSliders,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';
import styles from './ModelSidebar.module.less';

const menuItems = [
  {icon: faPenToSquare, description: 'Setup', title: true, active: false},
  {icon: faBorderAll, description: 'Model grid', active: false},
  {icon: faClock, description: 'Stress periods', active: true},
  {icon: faLayerGroup, description: 'Model layers', active: false},
  {icon: faFlag, description: 'Boundary conditions', active: false},
  {icon: faLocationCrosshairs, description: 'Head observations', active: false},
  {icon: faCompress, description: 'Solute transport', active: false},
  {icon: faBarsStaggered, description: 'Variable density flow', active: false},
  {icon: faSliders, description: 'PACKAGES', title: true, active: false},
  {icon: faFolder, description: 'MODFLOW packages', active: false},
  {icon: faCompress, description: 'MT3DMS packages', disabled: true, active: false},
  {icon: faBarsStaggered, description: 'SEAWAT packages', disabled: true, active: false},
  {icon: faSquareCheck, description: 'RESULTS', title: true, active: false},
  {icon: faMap, description: 'Groundwater heads', active: false},
  {icon: faChartSimple, description: 'Budget', active: false},
  {icon: faCircle, description: 'Concentration', disabled: true, active: false},
  {icon: faChartLine, description: 'Calibration statistics', active: false},
  {icon: faArrowUpRightFromSquare, description: 'EXPORT', title: true, active: false},
  {icon: faNoteSticky, description: 'Export model (JSON)', active: false},
  {icon: faImage, description: 'Export model results', active: false},
  {icon: faDownload, description: 'Download MODFLOW files', active: false},
];

interface IProps {
  showModelSidebar: boolean;
}

const ModelSidebar: React.FC<IProps> = ({showModelSidebar}) => {
  const [listItems, setListItems] = useState(menuItems);

  const handleItemClick = (index: number) => {
    const updatedListParameters = listItems.map((item, i) => {
      return (i === index) ? {...item, active: true} : {...item, active: false};
    });
    setListItems(updatedListParameters);
  };


  return (
    <div className={`${styles.menu} ${showModelSidebar ? styles.showSidebar : ''}`}>
      {showModelSidebar && (
        <div className={styles.listWrapper}>
          <ul className={styles.listScroll}>
            {listItems.map((item, index) => (
              <li
                key={index}
                className={`${styles.item} ${item.title ? styles.title : ''} ${item.active ? styles.active : ''} ${item.disabled ? styles.disabled : ''}`}
              >
                <Menu.Item
                  data-testid={`test-item-${item.description.toLowerCase().replace(/ /g, '-')}`}
                  as={item.title ? 'h3' : 'a'}
                  className={styles.link}
                  onClick={(e) => handleItemClick(index)}
                >
                  <span className={styles.icon}><FontAwesomeIcon icon={item.icon}/></span>
                  <span className={styles.description}>{item.description}</span>
                </Menu.Item>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

  );
};

export default ModelSidebar;



