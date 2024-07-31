import React from 'react';

import styles from './CardGrid.module.less';
import ModelCard, {ICard} from '../Card';
import SectionTitle from 'common/components/SectionTitle';

interface ICardGrid {
  title?: string | React.ReactNode;
  cards: ICard[];
}

const CardGrid: React.FC<ICardGrid> = ({
  title,
  cards,
}) => (
  <div data-testid="model-grid" className={styles.modelGridWrapper}>
    <div className={styles.modelGridHeader}>
      {title && <SectionTitle
        title={title}
        as={'h1'}
        secondary={true}
      />}
    </div>
    <div
      className="scrollWrapper-X"
      style={{
        padding: 20,
        width: 'calc(100% + 40px)',
        height: 'calc(100% + 40px)',
        margin: '-20px',
      }}
    >
      <div className={styles.modelGrid}>
        {cards.map((item) => (
          <ModelCard
            key={item.key}
            title={item.title}
            description={item.description}
            image={item.image}
            author={item.author}
            date_time={item.date_time}
            status={item.status}
            onViewClick={item.onViewClick}
            onCopyClick={item.onCopyClick}
            onDeleteClick={item.onDeleteClick}
          />
        ))}
      </div>
    </div>
  </div>
);

export default CardGrid;
export type {ICard};
