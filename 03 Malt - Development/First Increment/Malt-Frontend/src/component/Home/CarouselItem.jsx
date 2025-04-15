import React from "react";

export const CarouselItem = ({ image, title }) => {
  return (
    <div className="flex flex-col justify-center items-center px-2">
      <img
        className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-44 lg:h-44 rounded-full object-cover object-center"
        src={image || "backup-image-url.jpg"}
        alt="food-image"
      />
      <span className="pt-4 text-center font-semibold text-sm sm:text-base md:text-lg text-gray-700">
        {title}
      </span>
    </div>
  );
};
