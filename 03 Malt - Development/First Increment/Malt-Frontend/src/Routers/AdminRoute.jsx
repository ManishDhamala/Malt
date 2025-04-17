import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { PrivateRoute } from "./PrivateRoute";
import { Admin } from "../AdminComponent/Admin/Admin";
import { CreateRestaurantForm } from "../AdminComponent/RestaurantForm/CreateRestaurantForm";

export const AdminRoute = () => {
  const { restaurant } = useSelector((store) => store);

  return (
    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_RESTAURANT_OWNER"]}>
      <Routes>
        {/* This handles all nested routes inside Admin including /event, /menu, /events/create, etc. */}
        <Route
          path="/*"
          element={
            restaurant.usersRestaurant ? <Admin /> : <CreateRestaurantForm />
          }
        />
      </Routes>
    </PrivateRoute>
  );
};
