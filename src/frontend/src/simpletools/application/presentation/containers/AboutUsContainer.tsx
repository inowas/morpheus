import React, {useEffect, useState} from 'react';

import PageTitle from '../components/PageTitle';
import {useTranslate} from '../../application';

const AboutUsContainer: React.FC = () => {

  const {translate} = useTranslate();

  const [content, setContent] = useState<string>('');

  const fetchWordPress = async (page: number) => {
    try {
      const response = await fetch(`https://inowas.com/wp-json/wp/v2/pages/${page}`);
      const data = await response.json();
      setContent(data.content.rendered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWordPress(3784);
  }, []);

  return (
    <>
      <PageTitle title={translate('software_releases')}/>
      <div dangerouslySetInnerHTML={{__html: content}} style={{margin: '30px 0'}}></div>
    </>
  );
};

export default AboutUsContainer;
