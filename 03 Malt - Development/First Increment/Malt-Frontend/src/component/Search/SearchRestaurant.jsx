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
import CenterLoader from "../Templates/CenterLoader";
import NoDataFound from "../Templates/NoDataFound";

export const SearchRestaurant = () => {
  const dispatch = useDispatch();
  const { restaurants, searchedRestaurants, loading } = useSelector(
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

      {loading ? (
        <CenterLoader message="Loading restaurants..." />
      ) : (
        <div className="flex flex-wrap gap-6 ml-6 mb-10 justify-evenly">
          {Array.isArray(results) && results.length > 0 ? (
            results
              .sort((a, b) => a.id - b.id)
              .map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))
          ) : (
            <NoDataFound
              title="No Restaurants Found"
              description="Try a different search or explore all restaurants."
              icon={
                <SearchIcon fontSize="large" className="text-gray-400 mb-4" />
              }
            />
          )}
        </div>
      )}
    </div>
  );
};
