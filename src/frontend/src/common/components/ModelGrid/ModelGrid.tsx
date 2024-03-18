import ModelCard, {IProjectCard} from 'common/components/ModelCard';

import React from 'react';
import SectionTitle from '../SectionTitle';
import styles from './ModelGrid.module.less';
import {ISortOption} from 'common/components/SortDropdown';
import {SortDropdown} from 'common/components';

interface ModelGridProps {
  sortOptions?: ISortOption[];
  setModelData?: (data: IProjectCard[]) => void;
  placeholder?: string;

  sectionTitle?: string | React.ReactNode;
  data: IProjectCard[];
  handleDeleteButtonClick?: ((id: number) => void) | undefined;
  handleCopyButtonClick?: ((id: number) => void) | undefined;
}

const ModelGrid: React.FC<ModelGridProps> = ({
  sortOptions,
  setModelData,
  placeholder = 'Order By',
  sectionTitle,
  data,
  handleDeleteButtonClick,
  handleCopyButtonClick,
}) => {

  return (
    <div
      data-testid="model-grid"
      className={styles.modelGridWrapper}
    >
      <div className={styles.modelGridHeader}>
        {sectionTitle && <SectionTitle title={sectionTitle}/>}
        {setModelData && sortOptions && <SortDropdown
          placeholder={placeholder}
          setModelData={setModelData}
          sortOptions={sortOptions}
          data={data}
        />}
      </div>
      <div
        className="scrollWrapper-X" style={{
          padding: 20,
          width: 'calc(100% + 40px)',
          height: 'calc(100% + 40px)',
          margin: '-20px',
        }}
      >
        <div className={styles.modelGrid}>
          {data.map((item) => (
            <ModelCard
              className={styles.modelGridItem}
              key={item.id} data={item}
              onClick={item.onClick}
              onDeleteButtonClick={handleDeleteButtonClick && (() => handleDeleteButtonClick(item.id))}
              onCopyButtonClick={handleCopyButtonClick && (() => handleCopyButtonClick(item.id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelGrid;
