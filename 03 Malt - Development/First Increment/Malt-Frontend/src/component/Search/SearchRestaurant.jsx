import React, { useEffect, useState, useCallback } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRestaurantsAction,
  searchRestaurant,
} from "../State/Restaurant/Action";
import { RestaurantCard } from "../Restaurant/RestaurantCard";

export const SearchRestaurant = () => {
  const dispatch = useDispatch();
  const { restaurants, searchedRestaurants } = useSelector(
    (store) => store.restaurant
  );
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    dispatch(getAllRestaurantsAction());
  }, [dispatch]);

  const debouncedSearch = useCallback(
    debounce((keyword) => {
      if (keyword.trim()) {
        dispatch(searchRestaurant({ keyword }));
      } else {
        dispatch(getAllRestaurantsAction());
      }
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    debouncedSearch(value);
  };

  const results = searchKeyword.trim() ? searchedRestaurants : restaurants;

  return (
    <div className="w-full px-5 lg:px-20">
      <div className="flex justify-center my-5">
        <TextField
          variant="outlined"
          placeholder="Search Restaurants..."
          value={searchKeyword}
          onChange={handleInputChange}
          sx={{ width: "60%" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <h1 className="text-2xl font-semibold text-gray-700 pb-4 ml-6">
        Restaurants
      </h1>

      <div className="flex flex-wrap gap-6 ml-6 mb-10">
        {Array.isArray(results) && results.length > 0 ? (
          results
            .sort((a, b) => a.id - b.id)
            .map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
        ) : (
          <div className="text-center w-full mt-10">
            <p className="text-gray-500 text-lg font-medium">
              No restaurants found.
            </p>
            <img
              className="w-[250px] mx-auto mt-4 opacity-80 rounded-full"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd8LWlb8l34MXvr3BonwEYsd11lw1QKQVEiQ&s"
              alt="Not Found"
            />
          </div>
        )}
      </div>
    </div>
  );
};
