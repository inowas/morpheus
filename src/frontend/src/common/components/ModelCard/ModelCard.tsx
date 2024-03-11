import {Icon, Image, Button as SemanticButton} from 'semantic-ui-react';

import Button from '../Button/Button';
import {IModelCard} from './types/ModelCard.type';
import React from 'react';
import styles from './ModelCard.module.less';

interface ModelGridItemProps {
  className?: string;
  data: IModelCard;
  navigateTo: (path: string) => void;
  onDeleteButtonClick?: (() => void) | undefined;
  onCopyButtonClick?: (() => void) | undefined;
}

const ModelCard: React.FC<ModelGridItemProps> = ({
  className,
  data,
  navigateTo,
  onDeleteButtonClick,
  onCopyButtonClick,
}) => {

  const formattedDate = data.meta_text.replace(/\//g, '.');
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
        console.log('ModelGridItem clicked');
        // navigateTo(data.model_Link);
      }}
    >
      <Image
        className={styles.modelImage}
        src={data.model_image}
        alt={data.model_description}
        fluid={true}
        width="320" height="150"
      />
      <div className={styles.modelContent}>
        <div className={styles.modelHeadline}>
          <i className={styles.metaStatus} style={{background: data.meta_status ? '#08E600' : '#C8C8C8'}}></i>
          <h5 className={styles.modelTitle}>{data.model_title}</h5>
          <p className={styles.modelDescription}>{renderDescription(data.model_description)}</p>
        </div>

        <div className={styles.modelBtnGroup}>
          <div className={styles.modelAuthor}>
            <SemanticButton
              className={styles.modelAvatarLink}
              as="a"
              onClick={(e) => {
                e.stopPropagation();
                navigateTo(data.meta_link);
              }}
            >
              <Image
                avatar={true}
                // src={data.meta_author_avatar}
                src={'https://www.gravatar.com/avatar/4d94d3e077d7b5f527ac629be4800130/?s=80'}
                alt={data.meta_author_name}
                width="14"
                height="14"
              />
              {data.meta_author_name}
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
                // navigateTo(data.model_map);
                console.log(window.location.href);
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