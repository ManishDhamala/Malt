import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PrivateRoute } from "./PrivateRoute";
import { Admin } from "../AdminComponent/Admin/Admin";
import { CreateRestaurantForm } from "../AdminComponent/RestaurantForm/CreateRestaurantForm";
import { logout } from "../component/State/Authentication/Action";

export const AdminRoute = () => {
  const { restaurant } = useSelector((store) => store);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCancel = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_RESTAURANT_OWNER"]}>
      <Routes>
        <Route
          path="/*"
          element={
            restaurant.usersRestaurant ? (
              <Admin />
            ) : (
              <CreateRestaurantForm onCancel={handleCancel} />
            )
          }
        />
      </Routes>
    </PrivateRoute>
  );
};
