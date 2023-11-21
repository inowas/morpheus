import React from 'react';
import ModelGridItem from './ModelGridItem';
import styles from './ModelGrid.module.less';
import {IModelGridItem} from './types/ModelGrid.type';
import SectionTitle from '../SectionTitle';


interface ModelGridProps {
  sectionTitle?: string;
  data: IModelGridItem[];
  navigateTo: (path: string) => void;
  handleDeleteButtonClick: (id: number) => void;
  handleCopyButtonClick: (id: number) => void;
}

const ModelGrid: React.FC<ModelGridProps> = ({sectionTitle, data, navigateTo, handleDeleteButtonClick, handleCopyButtonClick}) => {


  return (
    <div className={styles.modelGridWrapper}>
      {sectionTitle && <SectionTitle title={sectionTitle}/>}
      <div className={styles.modelGrid}>
        {data.map((item) => (
          <ModelGridItem
            className={styles.modelGridItem}
            key={item.id} data={item}
            navigateTo={navigateTo}
            onDeleteButtonClick={() => handleDeleteButtonClick(item.id)}
            onCopyButtonClick={() => handleCopyButtonClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ModelGrid;
