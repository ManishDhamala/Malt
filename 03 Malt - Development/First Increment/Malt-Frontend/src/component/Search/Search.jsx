import React, { useEffect, useState } from "react";
import { RestaurantCard } from "../Restaurant/RestaurantCard";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRestaurantsAction,
  searchRestaurant,
} from "../State/Restaurant/Action";
import { HomeFooter } from "../Home/HomeFooter";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash"; //  Import debounce for optimization

export const Search = () => {
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState(""); //  State for search input

  const dispatch = useDispatch();
  const { restaurant } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getAllRestaurantsAction()).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  //  Debounced search function to prevent too many API calls
  const debouncedSearch = debounce((keyword) => {
    if (keyword.trim() !== "") {
      dispatch(searchRestaurant({ keyword }));
    } else {
      dispatch(getAllRestaurantsAction()); // Reset when search is cleared
    }
  }, 500); //  500ms delay for better performance

  const handleSearch = () => {
    if (searchKeyword.trim() !== "") {
      dispatch(searchRestaurant({ keyword: searchKeyword }));
    } else {
      dispatch(getAllRestaurantsAction()); // Reset to all restaurants if empty search
    }
  };

  const handleInputChange = (e) => {
    setSearchKeyword(e.target.value);
    debouncedSearch(e.target.value);
  };

  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     handleSearch();
  //   }
  // };

  // Show loading until restaurant data is available
  if (loading || !restaurant?.restaurants) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 text-lg">Loading restaurant details...</p>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <section className="px-5 lg:px-20 pt-5">
        {/* Search Bar */}
        <div className="flex justify-center mb-5">
          <TextField
            variant="outlined"
            placeholder="Search Restaurants..."
            value={searchKeyword}
            onChange={handleInputChange}
            sx={{ width: "45%" }} // Adjust width as needed
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

        <h1 className="text-2xl font-semibold text-gray-700 pb-5 ml-8">
          Restaurants
        </h1>

        {/* Display Searched Restaurants */}
        <div className="flex flex-wrap gap-10 ml-8 justify-items-start">
          {Array.isArray(restaurant?.searchedRestaurants) ? (
            restaurant.searchedRestaurants.length > 0 ? (
              restaurant.searchedRestaurants
                .sort((a, b) => a.id - b.id)
                .map((item) => (
                  <RestaurantCard key={item.id} restaurant={item} />
                ))
            ) : (
              <div className="flex flex-col items-center justify-center mt-4 lg:ml-100">
                <p className="text-gray-500 text-xl font-semibold">
                  No restaurants found
                </p>
                <img
                  className="w-[250px] h-auto mt-4 opacity-100 rounded-full"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd8LWlb8l34MXvr3BonwEYsd11lw1QKQVEiQ&s"
                  alt="Not Found"
                />
              </div>
            )
          ) : (
            <p className="text-gray-500">No restaurants available</p>
          )}
        </div>
      </section>
      <HomeFooter />
    </div>
  );
};
