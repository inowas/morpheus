import React, {useState} from 'react';
import ModelGridItem from './ModelGridItem';
import styles from './ModelGrid.module.less';
import {IModelGridItem} from './types/ModelGrid.type';
import SortDropdown from 'components/SortDropdown';
import {ISortOption} from 'components/SortDropdown/types/SortDropdown.type';

interface ModelGridProps {
  data: IModelGridItem[];
  navigateTo: (path: string) => void;
}

const sortOptions: ISortOption[] = [
  {text: 'Sort by Author', value: 'author'},
  {text: 'Most Recent', value: 'mostRecent'},
  {text: 'Less Recent', value: 'lessRecent'},
  {text: 'A-Z', value: 'aToZ'},
  {text: 'Z-A', value: 'zToA'},
  {text: 'Most Popular', value: 'mostPopular'},
];

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
      <div className={styles.modelGridHeadline}>
        {title && (
          <div className={styles.title}>
            <h2>{title}</h2>
          </div>
        )}
        <SortDropdown
          placeholder="Order By"
          sortOptions={sortOptions}
          data={modelData}
          setModelData={setModelData}
        />
      </div>
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
