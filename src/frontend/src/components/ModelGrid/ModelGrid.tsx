import React from 'react';
import ModelCard, {IModelCard} from 'components/ModelCard';
import styles from './ModelGrid.module.less';
import SectionTitle from '../SectionTitle';

interface ModelGridProps {
  sectionTitle?: string;
  data: IModelCard[];
  navigateTo: (path: string) => void;
  handleDeleteButtonClick: (id: number) => void;
  handleCopyButtonClick: (id: number) => void;
  columns?: number;
}

const ModelGrid: React.FC<ModelGridProps> = ({sectionTitle, data, navigateTo, handleDeleteButtonClick, handleCopyButtonClick, columns = 4}) => {

  const gridColumns = `gridColumns${columns}`;

  return (
    <div
      data-testid="model-grid"
      className={sectionTitle ? `${styles.modelGridWrapper + ' sectionTitled'}` : styles.modelGridWrapper}
    >
      {sectionTitle && <SectionTitle title={sectionTitle}/>}
      <div
        className={`${styles.modelGrid} ${styles[gridColumns]} || ''`}
      >
        {data.map((item) => (
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
