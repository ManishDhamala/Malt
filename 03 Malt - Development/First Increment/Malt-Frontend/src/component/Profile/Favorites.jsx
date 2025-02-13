import React from "react";
//import { RestaurantList } from "../Restaurant/RestaurantList";
import { RestaurantCard } from "../Restaurant/RestaurantCard";
import { useSelector } from "react-redux";

export const Favorites = () => {
  const { auth } = useSelector((store) => store);

  return (
    <div className="lg:mt-22">
      <h1 className="py-5 text-xl font-semibold text-center">My Favorites</h1>
      <div className="flex flex-wrap gap-3 justify-center">
        {auth.favourites.map((item) => {
          console.log("Favorite Item:", item); // ✅ Debugging Line
          return <RestaurantCard key={item.id} restaurant={item} />;
        })}
      </div>
    </div>
  );
};
