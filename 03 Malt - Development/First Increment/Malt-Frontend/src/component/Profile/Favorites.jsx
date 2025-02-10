import React from "react";
import { RestaurantList } from "../Restaurant/RestaurantList";

export const Favorites = () => {
  return (
    <div className="lg:mt-22">
      <h1 className="py-5 text-xl font-semibold text-center">My Favorites</h1>
      <div className="flex flex-wrap gap-3 justify-center">
        {[1].map((item) => (
          <RestaurantList />
        ))}
      </div>
    </div>
  );
};
