import React, { useEffect, useState, useCallback } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { MenuCard } from "../Restaurant/MenuCard";
import { searchMenuItem } from "../State/Menu/Action";

export const SearchFood = () => {
  const dispatch = useDispatch();
  const { search: searchResults, loading } = useSelector((store) => store.menu);

  const [keyword, setKeyword] = useState("");

  const jwt = localStorage.getItem("jwt");

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.trim() !== "") {
        dispatch(searchMenuItem({ keyword: value, jwt }));
      }
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  return (
    <div className="w-full px-5 lg:px-20">
      {/* Search Bar */}
      <div className="flex justify-center my-5">
        <TextField
          variant="outlined"
          placeholder="Search Food Items..."
          value={keyword}
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
        Food Items
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-600 mt-6">Searching...</div>
      )}

      {/* Display Search Results */}
      <div className="flex flex-col items-center gap-4">
        {!loading && searchResults?.length > 0 ? (
          Array.from(
            new Map(searchResults.map((item) => [item.id, item])).values()
          )
            .filter((item) => item.restaurant && item.restaurant.name)
            .map((item) => (
              <div key={item.id} className="w-full max-w-3xl">
                <p className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                  Restaurant: {item.restaurant.name}
                </p>

                <div className="ml-2">
                  <MenuCard item={item} />
                </div>
              </div>
            ))
        ) : !loading && keyword.trim() !== "" ? (
          <div className="text-center mt-8">
            <p className="text-gray-500 text-lg font-medium">
              No food items found.
            </p>
            <img
              className="w-[250px] mx-auto mt-4 opacity-80 rounded-full"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd8LWlb8l34MXvr3BonwEYsd11lw1QKQVEiQ&s"
              alt="Not Found"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
