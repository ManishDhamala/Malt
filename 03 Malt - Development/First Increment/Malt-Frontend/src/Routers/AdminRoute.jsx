import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CreateRestaurantForm } from "../AdminComponent/RestaurantForm/CreateRestaurantForm";
import { Admin } from "../AdminComponent/Admin/Admin";
import { useSelector } from "react-redux";

export const AdminRoute = () => {
  const { auth, restaurant } = useSelector((store) => store);

  // Only admin should be able to access
  const isAdmin =
    auth.user?.role === "ROLE_RESTAURANT_OWNER" ||
    auth.user?.role === "ROLE_ADMIN";

  return (
    <div>
      <Routes>
        <Route
          path="/*"
          element={
            isAdmin ? (
              !restaurant.usersRestaurant ? (
                <CreateRestaurantForm />
              ) : (
                <Admin />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        ></Route>
      </Routes>
    </div>
  );
};
