import {Icon, Image, Button as SemanticButton} from 'semantic-ui-react';

import Button from '../Button/Button';
import {IProjectCard} from './types/ModelCard.type';
import React from 'react';
import styles from './ModelCard.module.less';

interface ModelGridItemProps {
  className?: string;
  data: IProjectCard;
  onClick?: () => void;
  onDeleteButtonClick?: (() => void) | undefined;
  onCopyButtonClick?: (() => void) | undefined;
}

const ModelCard: React.FC<ModelGridItemProps> = ({
  className,
  data,
  onClick,
  onDeleteButtonClick,
  onCopyButtonClick,
}) => {

  const formattedDate = data.last_updated_at.replace(/\//g, '.');
  const renderDescription = (description: string) => {
    const maxLength = 40;
    if (maxLength >= description.length) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  };

  return (
    <div
      data-testid="model-card"
      className={className ? `${styles.modelCard} ${className}` : styles.modelCard}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <Image
        className={styles.modelImage}
        src={data.image}
        alt={data.description}
        fluid={true}
        width="320" height="150"
      />
      <div className={styles.modelContent}>
        <div className={styles.modelHeadline}>
          <i className={styles.metaStatus} style={{background: data.status_color}}></i>
          <h5 className={styles.modelTitle}>{data.name}</h5>
          <p className={styles.modelDescription}>{renderDescription(data.description)}</p>
        </div>

        <div className={styles.modelBtnGroup}>
          <div className={styles.modelAuthor}>
            <SemanticButton
              className={styles.modelAvatarLink}
              as="a"
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
              }}
            >
              <Icon name="user" style={{margin: '5'}}/>
              {data.owner_name}
            </SemanticButton>
            <span className={styles.modelMetaText}><Icon className={styles.metaIcon} name="calendar outline"/>{formattedDate}</span>
          </div>
          <div className={styles.modelActions}>
            {onDeleteButtonClick &&
              (<SemanticButton
                className={styles.buttonIcon}
                data-testid="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteButtonClick();
                }}
              >
                <Icon
                  style={{margin: '0'}} className={styles.metaIcon}
                  name="trash alternate outline"
                />
              </SemanticButton>
              )}
            {onCopyButtonClick && (
              <SemanticButton
                className={styles.buttonIcon}
                data-testid="copy-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyButtonClick();
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
                if (onClick) onClick();
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
