// import { Home } from "@mui/icons-material";
import { Route, Routes } from "react-router-dom";
import { Home } from "../Home/Home";
import React from "react";

export const CustomerRoute = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account/:register" element={<Home />} />
      </Routes>
    </div>
  );
};
