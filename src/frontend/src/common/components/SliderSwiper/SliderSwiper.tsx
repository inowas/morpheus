// Import Swiper styles
import './SliderSwiper.less';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// eslint-disable-next-line import/no-extraneous-dependencies
import {Navigation, Pagination} from 'swiper/modules';
import React, {ReactNode} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';

import SectionTitle from 'common/components/SectionTitle';

interface IProps {
  sectionTitle?: string | React.ReactNode;
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


