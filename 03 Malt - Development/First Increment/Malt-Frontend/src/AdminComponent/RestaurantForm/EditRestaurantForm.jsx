import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { CreateRestaurantForm } from "./CreateRestaurantForm";
import { updateRestaurant } from "../../component/State/Restaurant/Action";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../component/Templates/AlertProvider";

export const EditRestaurantForm = () => {
  const { restaurant } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const data = restaurant?.usersRestaurant;
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const initialData = {
    name: data?.name || "",
    description: data?.description || "",
    streetAddress: data?.address?.streetAddress || "",
    city: data?.address?.city || "",
    province: data?.address?.province || "",
    postalCode: data?.address?.postalCode || "",
    country: data?.address?.country || "",
    email: data?.contactInformation?.email || "",
    mobile: data?.contactInformation?.mobile || "",
    twitter: data?.contactInformation?.twitter || "",
    instagram: data?.contactInformation?.instagram || "",
    openingHours: data?.openingHours || "",
    images: data?.images || [],
  };

  const handleUpdate = (updatedData) => {
    dispatch(
      updateRestaurant({
        restaurantId: data.id,
        restaurantData: updatedData,
        jwt,
      })
    );
    navigate("/admin/restaurant/details");
    showAlert("success", "Restaurant details updated successfully");
  };

  return (
    <CreateRestaurantForm
      initialData={initialData}
      onSubmit={handleUpdate}
      isEdit={true}
    />
  );
};
