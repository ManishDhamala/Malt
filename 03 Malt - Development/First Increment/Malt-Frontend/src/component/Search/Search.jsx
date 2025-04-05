import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { SearchRestaurant } from "./SearchRestaurant";
import { SearchFood } from "./SearchFood";
import { HomeFooter } from "../Home/HomeFooter";
import { OrderBag } from "../Cart/OrderBag";

export const Search = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Optional
  };

  return (
    <div className="mt-20">
      <Box className="flex justify-center">
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Search Restaurants" />
          <Tab label="Search Food Items" />
        </Tabs>
      </Box>

      <Box className="pt-6">
        {tabIndex === 0 && <SearchRestaurant />}
        {tabIndex === 1 && <SearchFood />}
      </Box>

      <HomeFooter />
    </div>
  );
};
