import React from 'react';
import Iframe from 'react-iframe';

import {useTranslate, useNavigate} from '../../application';

import {Breadcrumb} from 'components';
import styles from './T11.module.less';

const tool = 'T11';

const T11 = () => {
  const navigateTo = useNavigate();
  const {translate} = useTranslate();

  const title = `${tool}: ${translate(`${tool}_title`)}`;

  return (
    <div
      className={styles.toolWrapper}
      data-testid={'T11-container'}
    >
      <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />
      <Iframe
        url={'https://inowas.shinyapps.io/mar_model_selection/'}
        position={'relative'}
        height={'1300px'}
        width={'100%'}
        className={styles.iframe}
      />
    </div>
  );
};

export default T11;
