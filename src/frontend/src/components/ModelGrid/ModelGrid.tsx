import React, {useState} from 'react';
import ModelCard from 'components/ModelCard';
import styles from './ModelGrid.module.less';
import {IModelCard} from 'components/ModelCard/types/ModelCard.type';
import SectionTitle from '../SectionTitle';
import SortDropdown from 'components/SortDropdown';
import {ISortOption} from 'components/SortDropdown/types/SortDropdown.type';

interface ModelGridProps {
  sectionTitle?: string;
  data: IModelCard[];
  navigateTo: (path: string) => void;
  handleDeleteButtonClick: (id: number) => void;
  handleCopyButtonClick: (id: number) => void;
  columns?: number;
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
const ModelGrid: React.FC<ModelGridProps> = ({sectionTitle, data, navigateTo, handleDeleteButtonClick, handleCopyButtonClick, columns = 4}) => {
  const [modelData, setModelData] = useState(data);

  const gridColumns = `gridColumns${columns}`;

  console.log(gridColumns);


  return (
    <div className={styles.modelGridWrapper}>
      {sectionTitle && <SectionTitle title={sectionTitle}/>}
      <SortDropdown
        placeholder="Order By"
        sortOptions={sortOptions}
        data={modelData}
        setModelData={setModelData}
      />
      <div
        className={`${styles.modelGrid} ${styles[gridColumns]} || ''`}
      >
        {modelData.map((item) => (
          <ModelCard
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
