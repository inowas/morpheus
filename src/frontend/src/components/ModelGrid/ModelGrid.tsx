import React, {useState} from 'react';
import ModelGridItem from './ModelGridItem';
import styles from './ModelGrid.module.less';
import {IModelGridItem} from './types/ModelGrid.type';


interface ModelGridProps {
  data: IModelGridItem[];
  navigateTo: (path: string) => void;
}

const title = 'All Models';

const ModelGrid: React.FC<ModelGridProps> = ({data, navigateTo}) => {

  const [modelData, setModelData] = useState(data);

  const handleDeleteButtonClick = (id: number) => {
    // Handle delete functionality here
    const updatedModelData = modelData.filter((item) => item.id !== id);
    setModelData(updatedModelData);
    console.log(`Delete button clicked for ID: ${id}`);
  };

  const handleCopyButtonClick = (id: number) => {
    // Handle copy functionality here
    console.log(`Copy button clicked for ID: ${id}`);
  };

  return (
    <div className={styles.modelGridWrapper}>
      {title && (
        <div className={styles.title}>
          <h2>{title}</h2>
        </div>
      )}
      <div className={styles.modelGrid}>
        {modelData.map((item) => (
          <ModelGridItem
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
