import { Routes, Route } from "react-router-dom";
import { CreateRestaurantForm } from "../AdminComponent/RestaurantForm/CreateRestaurantForm";
import { Admin } from "../AdminComponent/Admin/Admin";
import { useSelector } from "react-redux";
import { PrivateRoute } from "./PrivateRoute";

export const AdminRoute = () => {
  const { restaurant } = useSelector((store) => store);

  return (
    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_RESTAURANT_OWNER"]}>
      <Routes>
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
