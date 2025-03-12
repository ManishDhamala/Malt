// import { Home } from "@mui/icons-material";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import React from "react";
import { Home } from "../component/Home/Home";
import { RestaurantDetails } from "../component/Restaurant/RestaurantDetails";
import { Cart } from "../component/Cart/Cart";
import { Profile } from "../component/Profile/Profile";
import { Navbar } from "../component/Navbar/Navbar";
import { PaymentSuccess } from "../component/PaymentSuccess/PaymentSuccess";
import { useSelector } from "react-redux";

export const CustomerRoute = () => {
  const { auth } = useSelector((store) => store);
  const userRole = auth?.user?.role; // Get user role
  const isGuest = !userRole; // If no role is assigned, consider the user as a guest

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Accessible to both Admin, Customer, and Guests */}
        <Route path="/" element={<Home />} />
        <Route path="/account/:register" element={<Home />} />

        {/* Guests and Customers can access RestaurantDetails, but Admins are redirected */}
        <Route
          path="/restaurant/:city/:title/:id"
          element={
            userRole === "ROLE_RESTAURANT_OWNER" ||
            userRole === "ROLE_ADMIN" ? (
              <Navigate to="/" />
            ) : (
              <RestaurantDetails />
            )
          }
        />

        {/* Restrict these routes to only Customers */}
        {userRole === "ROLE_CUSTOMER" ? (
          <>
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-profile/*" element={<Profile />} />
            <Route path="/payment/success/:id" element={<PaymentSuccess />} />
          </>
        ) : isGuest ? (
          // Redirect guests (unauthenticated users) to login page (Second time condition)
          <>
            <Route path="/cart" element={<Navigate to="/account/login" />} />
            <Route
              path="/my-profile/*"
              element={<Navigate to="/account/login" />}
            />
          </>
        ) : (
          // Redirect Admins and other roles to home
          <>
            <Route path="/cart" element={<Navigate to="/" />} />
            <Route path="/my-profile/*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </div>
  );
};
