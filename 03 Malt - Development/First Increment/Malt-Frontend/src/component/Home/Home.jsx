import React, { useEffect, useState } from "react";
import "./home.css";
import { MultipleItemCarousel } from "./MultipleItemCarousel";
import { Authentication } from "../Authentication/Authentication";
import { useDispatch, useSelector } from "react-redux";
import { getAllRestaurantsAction } from "../State/Restaurant/Action";
import { RestaurantCard } from "../Restaurant/RestaurantCard";
import { useNavigate } from "react-router-dom";
import { findCart } from "../State/Cart/Action";
import { HomeFooter } from "./HomeFooter";
import CenterLoader from "../Templates/CenterLoader";

export const Home = () => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { restaurant } = useSelector((store) => store);
  const navigate = useNavigate();

  console.log("Restaurant store ", restaurant);

  useEffect(() => {
    dispatch(getAllRestaurantsAction());
    dispatch(findCart(jwt)).finally(() => {
      setLoading(false);
    });
  }, [dispatch, jwt]);

  // Show loading until restaurant data is available
  if (loading || !restaurant?.restaurants) {
    return <CenterLoader message="Loading restaurant details..." />;
  }

  return (
    <div className="lg:mt-16">
      <section className="banner -z-50 relative flex flex-col justify-center items-center">
        <div className="w-[50vw] z-10 text-center">
          <p className="text2xl text-gray-200 lg:text-6xl font-bold z-10 py-5">
            Malt
          </p>
          <p className="z-10 text-gray-100 text-xl lg:text-4xl">
            Discover the Joy of Eating - Eat, Sleep and Repeat
          </p>
        </div>
        <div className="cover absolute top-0 left-0 right-0"></div>

        <div className="fadeout"></div>
      </section>

      <section className="p-10 lg:py-8 lg:px-20">
        <h1 className=" text-2xl font-semibold text-gray-800 py-3 pb-10">
          Popular Meals
        </h1>
        <MultipleItemCarousel />
      </section>

      <section className="px-5 lg:px-20 pt-5 mb-10">
        <h1 className="text-2xl font-semibold text-gray-800 pb-5">
          Featured Restaurants
        </h1>
        <div className="flex flex-wrap gap-5 justify-evenly">
          {Array.isArray(restaurant?.restaurants) &&
          restaurant.restaurants.length > 0 ? (
            restaurant.restaurants
              .sort((a, b) => a.id - b.id)
              .map((item) => <RestaurantCard key={item.id} restaurant={item} />)
          ) : (
            <CenterLoader message="Loading featured restaurants..." />
          )}
        </div>
      </section>

      <Authentication />
      <HomeFooter />
    </div>
  );
};
