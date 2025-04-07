// import { Home } from "@mui/icons-material";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { Home } from "../component/Home/Home";
import { RestaurantDetails } from "../component/Restaurant/RestaurantDetails";
import { Cart } from "../component/Cart/Cart";
import { Profile } from "../component/Profile/Profile";
import { Navbar } from "../component/Navbar/Navbar";
import { PaymentSuccess } from "../component/PaymentSuccess/PaymentSuccess";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../component/Search/Search";
import { getUser } from "../component/State/Authentication/Action";
import KhaltiCallback from "../component/Cart/KhaltiCallBack";

export const CustomerRoute = () => {
  const dispatch = useDispatch();

  const { auth } = useSelector((store) => store);
  const userRole = auth?.user?.role; // Get user role
  const isGuest = !userRole; // If no role is assigned, consider the user as a guest

  useEffect(() => {
    if (auth?.jwt && !auth?.user) {
      dispatch(getUser(auth.jwt)); //  Fetch user details if JWT exists
    }
  }, [auth?.jwt, dispatch]);

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Accessible to both Admin, Customer, and Guests */}
        <Route path="/" element={<Home />} />
        <Route path="/account/:register" element={<Home />} />
        <Route path="/search" element={<Search />} />

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
            <Route
              path="/payment/khalti/callback"
              element={<KhaltiCallback />}
            />
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
