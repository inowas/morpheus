import ModelCard, {IModelCard} from 'common/components/ModelCard';

import React from 'react';
import SectionTitle from '../SectionTitle';
import styles from './ModelGrid.module.less';

interface ModelGridProps {
  sectionTitle?: string | React.ReactNode;
  data: IModelCard[];
  navigateTo: (path: string) => void;
  handleDeleteButtonClick?: ((id: number) => void) | undefined;
  handleCopyButtonClick?: ((id: number) => void) | undefined;
}

const ModelGrid: React.FC<ModelGridProps> = ({sectionTitle, data, navigateTo, handleDeleteButtonClick, handleCopyButtonClick}) => {

  return (
    <div
      data-testid="model-grid"
      className={sectionTitle ? `${styles.modelGridWrapper + ' sectionTitled'}` : styles.modelGridWrapper}
    >
      {sectionTitle && <SectionTitle title={sectionTitle}/>}
      <div className={styles.modelGrid}>
        {data.map((item) => (
          <ModelCard
            className={styles.modelGridItem}
            key={item.id} data={item}
            navigateTo={navigateTo}
            onDeleteButtonClick={handleDeleteButtonClick && (() => handleDeleteButtonClick(item.id))}
            onCopyButtonClick={handleCopyButtonClick && (() => handleCopyButtonClick(item.id))}
          />
        ))}
      </div>
    </div>
  );
};

export default ModelGrid;