// import { Home } from "@mui/icons-material";
import { Route, Routes, useNavigate } from "react-router-dom";
import React from "react";
import { Home } from "../component/Home/Home";
import { RestaurantDetails } from "../component/Restaurant/RestaurantDetails";
import { Cart } from "../component/Cart/Cart";
import { Profile } from "../component/Profile/Profile";
import { Navbar } from "../component/Navbar/Navbar";
import { PaymentSuccess } from "../component/PaymentSuccess/PaymentSuccess";
import { useSelector } from "react-redux";

export const CustomerRoute = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account/:register" element={<Home />} />
        <Route
          path="/restaurant/:city/:title/:id"
          element={<RestaurantDetails />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-profile/*" element={<Profile />} />
        <Route path="/payment/success/:id" element={<PaymentSuccess />} />
      </Routes>
    </div>
  );
};
