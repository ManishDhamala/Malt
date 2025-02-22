import { Button, TextField } from "@mui/material";
import React, { useState } from "react";

export const CreateFoodCategoryForm = () => {
  const [formData, setFormData] = useState({
    categoryName: "",
    restaurantId: "",
  });

  const handleSubmit = () => {
    const data = {
      name: formData.categoryName,
      restaurantId: {
        id: 1,
      },
    };
    console.log(data);
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
