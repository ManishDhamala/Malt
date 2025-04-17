import React from "react";
import { AdminSideBar } from "./AdminSideBar";
import { Route, Routes } from "react-router-dom";
import { Orders } from "../Orders/Orders";
import { Menu } from "../Menu/Menu";
import { FoodCategory } from "../FoodCategory/FoodCategory";
import { RestaurantDetails } from "./RestaurantDetails";
import { RestaurantDashboard } from "../Dashboard/RestaurantDashboard";
import { CreateMenuForm } from "../Menu/CreateMenuForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getRestaurantById,
  getRestaurantCategory,
} from "../../component/State/Restaurant/Action";
import { getMenuItemsByRestaurantId } from "../../component/State/Menu/Action";
import { getRestaurantOrders } from "../../component/State/Restaurant Order/Action";
import { EditRestaurantForm } from "../RestaurantForm/EditRestaurantForm";
import { AdminEvents } from "../Events/AdminEvents";
import { CreateEventForm } from "../Events/CreateEventForm";
import { EditEventForm } from "../Events/EditEventForm";

export const Admin = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const { restaurant } = useSelector((store) => store);

  const handleClose = () => {};

  useEffect(() => {
    dispatch(
      getRestaurantCategory({
        jwt,
        restaurantId: restaurant?.usersRestaurant?.id,
      })
    );

    dispatch(
      getRestaurantOrders({
        jwt,
        restaurantId: restaurant?.usersRestaurant?.id,
      })
    );
  }, [jwt]);

  return (
    <div>
      <div className="lg:flex justify-between">
        <div>
          <AdminSideBar handleClose={handleClose} />
        </div>
        <div className="lg:w-[80%]">
          <Routes>
            <Route path="/" element={<RestaurantDashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/category" element={<FoodCategory />} />
            <Route path="/event" element={<AdminEvents />} />
            <Route path="/events/create" element={<CreateEventForm />} />
            <Route path="/events/edit/:eventId" element={<EditEventForm />} />
            <Route path="/details" element={<RestaurantDetails />} />
            <Route path="/add-menu" element={<CreateMenuForm />} />
            <Route path="/edit" element={<EditRestaurantForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
