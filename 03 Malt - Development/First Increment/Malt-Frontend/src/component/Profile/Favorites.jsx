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

  //  Ensure both `auth.favourites` and `restaurant.restaurants` are defined
  const favorites = auth?.favourites || [];
  const allRestaurants = Array.isArray(restaurant?.restaurants)
    ? restaurant.restaurants
    : [];

  if (favorites.length === 0 || allRestaurants.length === 0) {
    return <p className="mt-30 ml-90">Loading Favorites Restaurant...</p>;
  }

  // Safely map favorites and attach "open" status
  const favoriteRestaurants = favorites
    .sort((a, b) => a.id - b.id)
    .map((fav) => {
      const matchingRestaurant = allRestaurants.find(
        (res) => res.id === fav.id
      );
      if (!matchingRestaurant) return null; //  Prevent undefined data

      return {
        ...fav,
        open: matchingRestaurant.open,
        address: matchingRestaurant.address || {}, // Ensure address is included
      };
    })
    .filter(Boolean); //  Remove null values

  if (favorites.length === 0 || allRestaurants.length === 0) {
    return <p className="mt-30 ml-90">Loading Favorites Restaurant...</p>;
  }

  return (
    <div className="lg:mt-22">
      <h1 className="py-5 text-xl font-semibold text-center">My Favorites</h1>
      <div className="flex flex-wrap gap-3 justify-center">
        {favoriteRestaurants.map((item) => {
          console.log("Favorite Item:", item); //  Debugging Line
          return <RestaurantCard key={item.id} restaurant={item} />;
        })}
      </div>
    </div>
  );
};
