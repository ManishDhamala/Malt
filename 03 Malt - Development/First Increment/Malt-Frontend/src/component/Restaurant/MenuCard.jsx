import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export const MenuCard = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 sm:gap-4 lg:gap-5 shadow-md border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-5 bg-white w-full max-w-2xl mx-auto relative">
      <img
        className="w-[5.5rem] h-[5.5rem] sm:w-[6.5rem] sm:h-[6.5rem] lg:w-[7rem] lg:h-[7rem] object-cover rounded-md"
        src="https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=400"
        alt="food-image"
      />

      <div className="flex flex-col space-y-1 sm:space-y-2 lg:space-y-3 lg:max-w-lg flex-grow">
        <p className="font-semibold text-base sm:text-lg text-gray-700">
          Pizza
        </p>
        <p className="text-sm sm:text-base font-medium">Rs 750</p>
        <p className="text-gray-700 text-xs sm:text-sm leading-snug">
          Pizza is a popular Italian dish with a flat, round dough topped with
          tomato sauce, cheese, and various toppings.
        </p>
      </div>

      <AddCircleIcon
        sx={{
          fontSize: "1.8rem",
          color: "#0aa13e",
          cursor: "pointer",
          "&:hover": { color: "#42cf73" },
        }}
        className="absolute top-3 right-3 lg:static lg:self-center"
      />
    </div>
  );
};
