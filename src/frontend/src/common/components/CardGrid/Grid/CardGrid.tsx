import React from 'react';

import styles from './CardGrid.module.less';
import ModelCard, {ICard} from '../Card';
import SectionTitle from 'common/components/SectionTitle';
import SortDropdown, {ISortOption} from '../SortDropdown';

interface ICardGrid {
  sortOptions?: ISortOption[];
  onChangeCards?: (data: ICard[]) => void;
  placeholder?: string;

  title?: string | React.ReactNode;
  cards: ICard[];
}

const CardGrid: React.FC<ICardGrid> = ({
  sortOptions,
  placeholder = 'Order By',
  title,
  cards,
  onChangeCards,
}) => (
  <div data-testid="model-grid" className={styles.modelGridWrapper}>
    <div className={styles.modelGridHeader}>

      {title && <SectionTitle title={title}/>}
      {onChangeCards && sortOptions && <SortDropdown
        placeholder={placeholder}
        setModelData={onChangeCards}
        sortOptions={sortOptions}
        data={cards}
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
          <div key={item.key}>
            <ModelCard
              key={item.id}
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
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CardGrid;
export type {ICard};
