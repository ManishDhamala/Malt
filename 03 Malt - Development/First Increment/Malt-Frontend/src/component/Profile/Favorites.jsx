import React, { useEffect, useState } from "react";
//import { RestaurantList } from "../Restaurant/RestaurantList";
import { RestaurantCard } from "../Restaurant/RestaurantCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllRestaurantsAction } from "../State/Restaurant/Action";

export const Favorites = () => {
  const { auth, restaurant } = useSelector((store) => store);

  const dispatch = useDispatch();

  console.log("Restaurant store ", restaurant);

  useEffect(() => {
    dispatch(getAllRestaurantsAction());
  }, [dispatch]);

  // Ensuring restaurants data is available before proceeding
  if (!restaurant.restaurants.length) {
    return <p className="mt-30 ml-90">Loading...</p>;
  }

  // Map favorites and attach the correct "open" status
  const favoriteRestaurants = auth.favourites.map((fav) => {
    const matchingRestaurant = restaurant.restaurants.find(
      (res) => res.id === fav.id
    );

    return {
      ...fav,
      open: matchingRestaurant ? matchingRestaurant.open : false, // Ensure correct open status
    };
  });

  return (
    <div className="lg:mt-22">
      <h1 className="py-5 text-xl font-semibold text-center">My Favorites</h1>
      <div className="flex flex-wrap gap-3 justify-center">
        {favoriteRestaurants.map((item) => {
          console.log("Favorite Item:", item); // ✅ Debugging Line
          return <RestaurantCard key={item.id} restaurant={item} />;
        })}
      </div>
    </div>
  );
};
