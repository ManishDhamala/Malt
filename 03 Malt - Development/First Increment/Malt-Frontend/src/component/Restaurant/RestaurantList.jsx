import React from "react";
import { RestaurantCard } from "./RestaurantCard";
import { restaurants } from "./restaurantData";

export const RestaurantList = () => {
  return (
    <div className="flex flex-wrap items-center justify-around gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
};
