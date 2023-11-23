import React, {ReactNode} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Navigation, Pagination} from 'swiper/modules';
// Import Swiper styles
import './SliderSwiper.less';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import SectionTitle from 'components/SectionTitle';

interface IProps {
  sectionTitle?: string;
  children: ReactNode;
}

const SliderSwiper = ({children, sectionTitle}: IProps) => {

  return (
    <div
      data-testid="swiper-container"
      className={sectionTitle ? 'swiper-container sectionTitled' : 'swiper-container'}
    >
      {sectionTitle && <SectionTitle title={sectionTitle}/>}
      {0 < React.Children.count(children) && (
        <Swiper
          slidesPerView={'auto'}
          modules={[Pagination, Navigation]}
          navigation={{nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev'}}
          pagination={{clickable: true, el: '.swiper-pagination'}}
        >
          {React.Children.map(children, child => <SwiperSlide>{child}</SwiperSlide>)}
          <div className="swiper-navigation">
            <div className="swiper-button-prev"></div>
            <div className="swiper-pagination"></div>
            <div className="swiper-button-next"></div>
          </div>
        </Swiper>
      )}
    </div>
  );
};

export default SliderSwiper;


