import React from 'react';
import styles from './hintPageComponent.module.less';

interface IProps {
  image: string;
  header: string;
  children: React.ReactNode;
}

const HintPageComponent = ({image, header, children}: IProps) => (
  <div className={styles.integrationsHint} data-testid={'hint-page-component'}>
    <div>
      <img
        className={styles.integrationsHintImage}
        src={image}
        alt="image"
      />
    </div>
    <h4 className={styles.integrationsHintTitle}>{header}</h4>
    <div className={styles.integrationsHintTextLink}>
      {children}
    </div>
  </div>
);

export default HintPageComponent;
