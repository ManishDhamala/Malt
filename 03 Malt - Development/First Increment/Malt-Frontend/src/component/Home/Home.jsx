import React from "react";
import "./home.css";
import { MultipleItemCarousel } from "./MultipleItemCarousel";
import { RestaurantList } from "../Restaurant/RestaurantList";
import { Authentication } from "../Authentication/Authentication";

export const Home = () => {
  return (
    <div className="pb-10">
      <section className="banner -z-50 relative flex flex-col justify-center items-center">
        <div className="w-[50vw] z-10 text-center">
          <p className="text2xl text-gray-300 lg:text-6xl font-bold z-10 py-5">
            Malt
          </p>
          <p className="z-10 text-gray-200 text-xl lg:text-4xl">
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

      <section className="px-5 lg:px-20 pt-5">
        <h1 className="text-2xl font-semibold text-gray-800 pb-6">
          Featured Restaurants
        </h1>
        <div>
          <RestaurantList />
        </div>
      </section>

      <Authentication />
    </div>
  );
};
