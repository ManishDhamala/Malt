import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../../component/State/Restaurant/Action";
import { useAlert } from "../../component/Templates/AlertProvider";

const initialValues = {
  categoryName: "",
  restaurantId: "",
};

export const CreateFoodCategoryForm = () => {
  const { restaurant } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const [formData, setFormData] = useState(initialValues);

  // Using AlertProvider(Global) Template
  const { showAlert } = useAlert();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formData.categoryName,
      restaurantId: restaurant?.usersRestaurant?.id,
    };
    dispatch(createCategory({ reqData: data, jwt }));
    console.log("Food Category ", data);
    setFormData(initialValues);

    // Alert, Message
    showAlert("success", "New food category added");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <div className="p-5">
        <h1 className="text-gray-900 text-center text-xl pb-10">
          Create Food Category
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField
              fullWidth
              id="categoryName"
              name="categoryName"
              label="Category Name"
              variant="outlined"
              onChange={handleInputChange}
              value={formData.categoryName}
            />
          </div>

          <Button fullWidth variant="contained" type="submit">
            Add new category
          </Button>
        </form>
      </div>
    </div>
  );
};
