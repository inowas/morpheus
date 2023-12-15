import React from 'react';
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

const ModelSidebar = () => {
  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, itemName: string) => {
    e.stopPropagation();
    // Handle click for each menu item based on `itemName`
    console.log(`Clicked on ${itemName}`);
  };

  const menuItems = [
    {icon: faPenToSquare, description: 'Setup', title: true},
    {icon: faBorderAll, description: 'Model grid'},
    {icon: faClock, description: 'Stress periods'},
    {icon: faLayerGroup, description: 'Model layers'},
    {icon: faFlag, description: 'Boundary conditions'},
    {icon: faLocationCrosshairs, description: 'Head observations'},
    {icon: faCompress, description: 'Solute transport'},
    {icon: faBarsStaggered, description: 'Variable density flow'},
    {icon: faSliders, description: 'PACKAGES', title: true},
    {icon: faFolder, description: 'MODFLOW packages'},
    {icon: faCompress, description: 'MT3DMS packages'},
    {icon: faBarsStaggered, description: 'SEAWAT packages'},
    {icon: faSquareCheck, description: 'RESULTS', title: true},
    {icon: faMap, description: 'Groundwater heads'},
    {icon: faChartSimple, description: 'Budget'},
    {icon: faCircle, description: 'Concentration'},
    {icon: faChartLine, description: 'Calibration statistics'},
    {icon: faArrowUpRightFromSquare, description: 'EXPORT', title: true},
    {icon: faNoteSticky, description: 'Export model (JSON)'},
    {icon: faImage, description: 'Export model results'},
    {icon: faDownload, description: 'Download MODFLOW files'},
  ];

  return (
    <div className={styles.menu}>
      <div className={styles.listWrapper}>
        <ul className={styles.listScroll}>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`${styles.item} ${item.title ? styles.title : ''}`}
            >
              <Menu.Item
                data-testid={`test-item-${item.description.toLowerCase().replace(/ /g, '-')}`}
                as="a"
                className={styles.link}
                onClick={(e) => handleItemClick(e, item.description)}
              >
                <span className={styles.icon}><FontAwesomeIcon icon={item.icon}/></span>
                <span className={styles.description}>{item.description}</span>
              </Menu.Item>
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
};

export default ModelSidebar;



