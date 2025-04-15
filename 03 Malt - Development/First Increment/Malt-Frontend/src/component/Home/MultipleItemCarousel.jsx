import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { CarouselItem } from "./CarouselItem";
import { topmeal } from "./topmeals";

export const MultipleItemCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,

    // Responsive breakpoints
    responsive: [
      {
        breakpoint: 1280, // For large devices (screen-width px)
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024, // For tablets and small laptops
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768, // For mobile landscape
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480, // For smaller phones
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <div className="w-full px-2">
      <Slider {...settings}>
        {topmeal.map((item, index) => (
          <CarouselItem key={index} image={item.image} title={item.title} />
        ))}
      </Slider>
    </div>
  );
};
