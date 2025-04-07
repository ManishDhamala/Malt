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
import { PrivateRoute } from "./PrivateRoute";

export const CustomerRoute = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const userRole = auth?.user?.role;

  useEffect(() => {
    if (auth?.jwt && !auth?.user) {
      dispatch(getUser(auth.jwt));
    }
  }, [auth?.jwt, dispatch]);

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Accessible to everyone */}
        <Route path="/" element={<Home />} />
        <Route path="/account/:register" element={<Home />} />

        {/* Block Admin/Owner from Restaurant Details and Search */}
        <Route
          path="/restaurant/:city/:title/:id"
          element={
            userRole === "ROLE_ADMIN" ||
            userRole === "ROLE_RESTAURANT_OWNER" ? (
              <Navigate to="/" />
            ) : (
              <RestaurantDetails />
            )
          }
        />
        <Route
          path="/search"
          element={
            userRole === "ROLE_ADMIN" ||
            userRole === "ROLE_RESTAURANT_OWNER" ? (
              <Navigate to="/" />
            ) : (
              <Search />
            )
          }
        />

        {/* Customer Only Routes (Protected) */}
        <Route
          path="/cart"
          element={
            <PrivateRoute allowedRoles={["ROLE_CUSTOMER"]}>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-profile/*"
          element={
            <PrivateRoute allowedRoles={["ROLE_CUSTOMER"]}>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/payment/khalti/callback"
          element={
            <PrivateRoute allowedRoles={["ROLE_CUSTOMER"]}>
              <KhaltiCallback />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment/success/:id"
          element={
            <PrivateRoute allowedRoles={["ROLE_CUSTOMER"]}>
              <PaymentSuccess />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};
