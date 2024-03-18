import ModelCard, {IProjectCard} from 'common/components/ModelCard';

import React from 'react';
import SectionTitle from '../SectionTitle';
import styles from './ModelGrid.module.less';

interface ModelGridProps {
  sectionTitle?: string | React.ReactNode;
  data: IProjectCard[];
  handleDeleteButtonClick?: ((id: number) => void) | undefined;
  handleCopyButtonClick?: ((id: number) => void) | undefined;
}

const ModelGrid: React.FC<ModelGridProps> = ({sectionTitle, data, handleDeleteButtonClick, handleCopyButtonClick}) => {

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
            key={item.projectId} data={item}
            onClick={item.onClick}
            onDeleteButtonClick={handleDeleteButtonClick && (() => handleDeleteButtonClick(item.projectId))}
            onCopyButtonClick={handleCopyButtonClick && (() => handleCopyButtonClick(item.projectId))}
          />
        ))}
      </div>
    </div>
  );
};

export default ModelGrid;
