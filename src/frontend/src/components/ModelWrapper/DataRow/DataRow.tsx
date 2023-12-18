import React, {ReactNode} from 'react';
import styles from './DataRow.module.less';
import Button from 'components/Button/Button';

interface IProps {
  title?: string;
  subTitle?: string;
  btnTitle?: string;
  onClick?: () => void;
  children?: ReactNode;
}

const DataRow = ({title, subTitle, btnTitle, onClick, children}: IProps) => {

  if (!title && !subTitle && !btnTitle && !children) {
    return null;
  }


  return (
    <div className={styles.dataRow}>
      {title && (
        <div className={styles.headline}>
          <h2 className={`${styles.title} h1`}>{title}</h2>
          {btnTitle && (
            <Button
              primary={true} size={'small'}
            >
              {btnTitle}
            </Button>
          )}
        </div>
      )}
      {(subTitle && !title) && (
        <div className={styles.headline}>
          <h3 className={`${styles.subtitle} h2`}>{subTitle}</h3>
          {btnTitle && (
            <Button
              primary={true} size={'small'}
            >
              {btnTitle}
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default DataRow;



