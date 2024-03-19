import {Icon, Image, Button as SemanticButton} from 'semantic-ui-react';

import Button from '../../Button/Button';
import React from 'react';
import styles from './ModelCard.module.less';

export interface ICard {
  key: string | number;
  title: string;
  description: string;
  image?: string;
  author: string;
  date_time: string;
  status: ICardStatus
  onViewClick?: () => void;
  onCopyClick?: () => void;
  onDeleteClick?: () => void;

  [key: string]: any;
}

type ICardStatus = 'green' | 'yellow' | 'red' | 'grey';
const ModelCard: React.FC<ICard> = ({
  title,
  description,
  image,
  author,
  date_time,
  status,
  onViewClick,
  onCopyClick,
  onDeleteClick,
  ...props
}) => {

  const renderDescription = (descr: string | undefined = '') => {
    const maxLength = 40;
    if (maxLength >= descr.length) {
      return descr;
    }
    return descr.substring(0, maxLength) + '...';
  };

  return (
    <div
      data-testid="model-card"
      className={props.className ? `${styles.modelCard} ${props.className}` : styles.modelCard}
      onClick={(e) => {
        e.stopPropagation();
        if (onViewClick) onViewClick();
      }}
    >
      {image ? <Image
        className={styles.modelImage}
        src={image}
        alt={description}
        fluid={true}
        width="320" height="150"
      /> : <div className={styles.imagePlaceholder}/>}

      <div className={styles.modelContent}>
        <div className={styles.modelHeadline}>
          <i className={styles.metaStatus} style={{background: status}}></i>
          <h5 className={styles.modelTitle}>{title}</h5>
          <p className={styles.modelDescription}>{renderDescription(description)}</p>
        </div>

        <div className={styles.modelBtnGroup}>
          <div className={styles.modelAuthor}>
            <SemanticButton
              className={styles.modelAvatarLink}
              as="a"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewClick) onViewClick();
              }}
            >
              <Icon name="user" style={{margin: '5'}}/>
              {author}
            </SemanticButton>
            <span className={styles.modelMetaText}><Icon className={styles.metaIcon} name="calendar outline"/>{date_time}</span>
          </div>
          <div className={styles.modelActions}>
            {onDeleteClick &&
              (<SemanticButton
                className={styles.buttonIcon}
                data-testid="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick();
                }}
              >
                <Icon
                  style={{margin: '0'}} className={styles.metaIcon}
                  name="trash alternate outline"
                />
              </SemanticButton>
              )}
            {onCopyClick && (
              <SemanticButton
                className={styles.buttonIcon}
                data-testid="copy-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyClick();
                }}
              >
                <Icon
                  style={{margin: '0'}} className={styles.metaIcon}
                  name="clone outline"
                />
              </SemanticButton>
            )}

            <Button
              size={'small'}
              onClick={(e) => {
                e.stopPropagation();
                if (onViewClick) onViewClick();
              }}
              aria-label="Open Tool"
            >View</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
