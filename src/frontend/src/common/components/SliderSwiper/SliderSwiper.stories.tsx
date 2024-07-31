// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
import {Meta, StoryFn} from '@storybook/react';
import {ICard} from '../CardGrid/Card';
import {ModelCard} from '../index';
import SliderSwiper from 'common/components/SliderSwiper';

const models: ICard[] = [
  {
    id: 0,
    description: 'A comprehensive guide to React development',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    title: 'React Mastery: The Complete Guide',
    model_Link: '/tools/01',
    model_map: '/tools/01',
    owner_avatar: '/author/JohnDoe.jpeg',
    author: 'John Doe',
    meta_link: 'https://metaLink1',
    date_time: '20.11.2023',
    status: false,
  },
  {
    id: 1,
    description: 'Explore the world of machine learning with Python',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    title: 'Machine Learning with Python',
    model_Link: '/tools/02',
    model_map: '/tools/01',
    owner_avatar: '/author/JaneSmith.jpeg',
    author: 'Jane Smith',
    meta_link: 'https://metaLink2',
    date_time: '20.11.2023',
    status: false,
  },
  {
    id: 2,
    description: 'Base model in the Ezousa valley',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    title: 'Ezousa MAR site',
    model_Link: '/tools/03',
    model_map: '/tools/01',
    owner_avatar: '/author/RobertJohnson.jpeg',
    author: 'Catalin Stefan',
    meta_link: 'https://metaLink3',
    date_time: '20.11.2023',
    status: true,
  },
  {
    id: 3,
    description: 'Small model at NU campus',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    title: 'Simulation ofSUDS impact',
    model_Link: '/tools/04',
    model_map: '/tools/01',
    owner_avatar: '/author/EmilyBrown.jpeg',
    author: 'Emily Brown',
    meta_link: 'https://metaLink4',
    date_time: '20.11.2023',
    status: true,
  },
  {
    id: 4,
    description: 'Explore the world of data science and analytics',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    title: 'Data Science Foundations',
    model_Link: '/tools/05',
    model_map: '/tools/01',
    owner_avatar: '/author/DavidWilson.jpeg',
    author: 'David Wilson',
    meta_link: 'https://metaLink5',
    date_time: '01.11.2023',
    status: true,
  },
  {
    id: 5,
    description: 'Introduction to cybersecurity and its applications',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    title: 'Cybersecurity Basics',
    model_Link: '/tools/06',
    model_map: '/tools/01',
    owner_avatar: '/author/AliceJohnson.jpeg',
    author: 'Alice Johnson',
    meta_link: 'https://metaLink6',
    date_time: '15.10.2023',
    status: true,
  },
  {
    id: 6,
    description: 'Discover the fundamentals of cloud computing',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg',
    title: 'Cloud Computing Essentials',
    model_Link: '/tools/07',
    model_map: '/tools/01',
    owner_avatar: '/author/JamesSmith.jpeg',
    author: 'James Smith',
    meta_link: 'https://metaLink7',
    date_time: '05.01.2020',
    status: false,
  },
  {
    id: 7,
    description: 'Model description 1',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    title: 'Model Title 1',
    model_Link: '/tools/08',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    author: 'Catalin Stefan',
    meta_link: 'https://metaLink8',
    date_time: '25.10.2023',
    status: true,
  },
  {
    id: 8,
    description: 'Model description 2',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg',
    title: 'Model Title 2',
    model_Link: '/tools/09',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    author: 'Catalin Stefan',
    meta_link: 'https://metaLink9',
    date_time: '27.10.2023',
    status: false,
  },
  {
    id: 9,
    description: 'Model description 3',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    title: 'Model Title 3',
    model_Link: '/tools/10',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    author: 'Catalin Stefan',
    meta_link: 'https://metaLink10',
    date_time: '30.10.2023',
    status: true,
  },
  {
    id: 10,
    description: 'Model description 4',
    image: 'image_url_4.jpg',
    title: 'Model Title 4',
    model_Link: '/tools/11',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    author: 'Catalin Stefan',
    meta_link: 'https://metaLink11',
    date_time: '02.10.2023',
    status: true,
  },
  {
    id: 11,
    description: 'Model description 5',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    title: 'Model Title 5',
    model_Link: '/tools/12',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    author: 'Catalin Stefan',
    meta_link: 'https://metaLink12',
    date_time: '05.10.2023',
    status: false,
  },
  {
    id: 12,
    description: 'Exploring Advanced Data Structures',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    title: 'Advanced Data Structures',
    model_Link: '/tools/13',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    author: 'Catalin Stefan',
    meta_link: 'https://metaLink13',
    date_time: '10.11.2023',
    status: true,
  },
  {
    id: 13,
    description: 'Introduction to Quantum Computing',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    title: 'Quantum Computing Basics',
    model_Link: '/tools/14',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    author: 'Catalin Stefan',
    meta_link: 'https://metaLink14',
    date_time: '03.09.2023',
    status: false,
  },
  {
    id: 14,
    description: 'Optimizing Neural Network Architectures',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    title: 'Neural Network Optimization',
    model_Link: '/tools/15',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    author: 'Catalin Stefan',
    meta_link: 'https://metaLink15',
    date_time: '20.08.2023',
    status: true,
  },
  {
    id: 15,
    description: 'Advanced Algorithms in Computational Biology',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg',
    title: 'Computational Biology Algorithms',
    model_Link: '/tools/16',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    author: 'Catalin Stefan',
    meta_link: 'https://metaLink16',
    date_time: '15.07.2023',
    status: false,
  },
  {
    id: 16,
    description: 'Introduction to Natural Language Processing',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    title: 'Natural Language Processing Basics',
    model_Link: '/tools/17',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    author: 'Catalin Stefan',
    meta_link: 'https://metaLink17',
    date_time: '25.06.2023',
    status: true,
  },
  {
    id: 17,
    description: 'Exploring Big Data Management Techniques',
    image:
      'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    title: 'Big Data Management',
    model_Link: '/tools/18',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    author: 'Catalin Stefan',
    meta_link: 'https://metaLink18',
    date_time: '10.05.2023',
    status: false,
  },
];

const children = [
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet commodi
    consequatur cumque ducimus laboriosam, mollitia pariatur. Asperiores
    corporis eum ex tempora? Atque est modi mollitia omnis perspiciatis quam
    ratione rerum.
  </div>,
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet commodi
    consequatur cumque ducimus laboriosam, mollitia pariatur. Asperiores
    corporis eum ex tempora? Atque est modi mollitia omnis perspiciatis quam
    ratione rerum.
  </div>,
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet commodi
    consequatur cumque ducimus laboriosam, mollitia pariatur. Asperiores
    corporis eum ex tempora? Atque est modi mollitia omnis perspiciatis quam
    ratione rerum.
  </div>,
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet commodi
    consequatur cumque ducimus laboriosam, mollitia pariatur. Asperiores
    corporis eum ex tempora? Atque est modi mollitia omnis perspiciatis quam
    ratione rerum.
  </div>,
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet commodi
    consequatur cumque ducimus laboriosam, mollitia pariatur. Asperiores
    corporis eum ex tempora? Atque est modi mollitia omnis perspiciatis quam
    ratione rerum.
  </div>,
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet commodi
    consequatur cumque ducimus laboriosam, mollitia pariatur. Asperiores
    corporis eum ex tempora? Atque est modi mollitia omnis perspiciatis quam
    ratione rerum.
  </div>,
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet commodi
    consequatur cumque ducimus laboriosam, mollitia pariatur. Asperiores
    corporis eum ex tempora? Atque est modi mollitia omnis perspiciatis quam
    ratione rerum.
  </div>,
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet commodi
    consequatur cumque ducimus laboriosam, mollitia pariatur. Asperiores
    corporis eum ex tempora? Atque est modi mollitia omnis perspiciatis quam
    ratione rerum.
  </div>,
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet commodi
    consequatur cumque ducimus laboriosam, mollitia pariatur. Asperiores
    corporis eum ex tempora? Atque est modi mollitia omnis perspiciatis quam
    ratione rerum.
  </div>,
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet commodi
    consequatur cumque ducimus laboriosam, mollitia pariatur. Asperiores
    corporis eum ex tempora? Atque est modi mollitia omnis perspiciatis quam
    ratione rerum.
  </div>,
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet commodi
    consequatur cumque ducimus laboriosam, mollitia pariatur. Asperiores
    corporis eum ex tempora? Atque est modi mollitia omnis perspiciatis quam
    ratione rerum.
  </div>,
  <div>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet commodi
    consequatur cumque ducimus laboriosam, mollitia pariatur. Asperiores
    corporis eum ex tempora? Atque est modi mollitia omnis perspiciatis quam
    ratione rerum.
  </div>,
];

const childrenImages = [
  <div style={{overflow: 'hidden'}}>
    <img src="https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg"/>
  </div>,
  <div style={{overflow: 'hidden'}}>
    <img src="https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg"/>
  </div>,
  <div style={{overflow: 'hidden'}}>
    <img src="https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg"/>
  </div>,
  <div style={{overflow: 'hidden'}}>
    <img src="https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg"/>
  </div>,
  <div style={{overflow: 'hidden'}}>
    <img src="https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg"/>
  </div>,
  <div style={{overflow: 'hidden'}}>
    <img src="https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg"/>
  </div>,
  <div style={{overflow: 'hidden'}}>
    <img src="https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg"/>
  </div>,
  <div style={{overflow: 'hidden'}}>
    <img src="https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg"/>
  </div>,
];

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'SliderSwiper',
  component: SliderSwiper,
} as Meta<typeof SliderSwiper>;

export const SliderSwiperExample: StoryFn<typeof SliderSwiper> = () => {
  return (
    <>
      <SliderSwiper sectionTitle={'Slider Models'}>
        {models.map((item) => (
          <ModelCard
            key={item.id}
            data={item}
            onDelete={() => console.log('Delete button clicked')}
            onCopy={() => console.log('Copy button clicked')}
          />
        ))}
      </SliderSwiper>
      <SliderSwiper sectionTitle={'Slider Text'} children={children}/>
      <SliderSwiper sectionTitle={'Slider Images'} children={childrenImages}/>
    </>
  );
};
