import React, { useEffect, useState, useCallback } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { MenuCard } from "../Restaurant/MenuCard";
import { searchMenuItem } from "../State/Menu/Action";
import CenterLoader from "../Templates/CenterLoader";
import NoDataFound from "../Templates/NoDataFound";

export const SearchFood = () => {
  const dispatch = useDispatch();
  const { search: searchResults, loading } = useSelector((store) => store.menu);

  const [keyword, setKeyword] = useState("");

  const jwt = localStorage.getItem("jwt");

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.trim() !== "") {
        dispatch(searchMenuItem({ keyword: value }));
      }
    }, 500),
    [dispatch]
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

      {/* Display Search Results */}
      <div className="flex flex-col items-center gap-4 mb-10">
        {(() => {
          const filteredResults = Array.from(
            new Map(searchResults.map((item) => [item.id, item])).values()
          ).filter(
            (item) =>
              item.available &&
              item.restaurant &&
              item.restaurant.name &&
              item.restaurant.open
          );

          if (loading) {
            return <CenterLoader message="Searching Food..." />;
          }

          if (keyword.trim() === "") {
            return (
              <NoDataFound
                title="Start Searching"
                description="Begin search by entering food name."
                icon="search"
              />
            );
          }

          if (filteredResults.length === 0) {
            return (
              <NoDataFound
                title="No Food items found"
                description="Try a different search or explore restaurants."
                icon="alert"
              />
            );
          }

          return filteredResults.map((item) => (
            <div key={item.id} className="w-full max-w-3xl">
              <p className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                Restaurant: {item.restaurant.name}
              </p>
              <div className="ml-2">
                <MenuCard item={item} />
              </div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
};
