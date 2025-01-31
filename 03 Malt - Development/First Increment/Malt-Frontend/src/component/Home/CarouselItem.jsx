import React from "react";

export const CarouselItem = ({ image, title }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <img
        className="w-[5rem] h-[5rem] lg:h-[11rem] lg:w-[11rem] rounded-full object-cover object-center"
        src={image || "backup-image-url.jpg"}
        alt="food-image"
      />
      <span className="py-5 font-semibold text-xl text-gray-700">{title}</span>
    </div>
  );
};
