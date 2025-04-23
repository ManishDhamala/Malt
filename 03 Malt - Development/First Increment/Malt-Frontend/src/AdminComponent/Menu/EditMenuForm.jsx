import { AddPhotoAlternate, Close as CloseIcon } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMenuItem } from "../../component/State/Menu/Action";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../component/Templates/AlertProvider";
import { uploadImageToCloudinary } from "../Util/UploadToCloudinary";

export const EditMenuForm = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { restaurant } = useSelector((store) => store);
  const { showAlert } = useAlert();

  const [uploadImage, setUploadImage] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: state?.name || "",
      description: state?.description || "",
      price: state?.price || "",
      category: state?.foodCategory?.id || "",
      restaurantId: state?.restaurantId,
      vegetarian: state?.vegetarian || false,
      images: state?.images || [],
    },
    onSubmit: (values) => {
      const updatedData = {
        name: values.name,
        description: values.description,
        price: values.price,
        categoryId: values.category,
        restaurantId: values.restaurantId,
        vegetarian: values.vegetarian,
        images: values.images,
      };

      dispatch(updateMenuItem({ foodId: id, foodData: updatedData, jwt }))
        .then(() => {
          showAlert("success", "Menu item updated");
          navigate("/admin/restaurant/menu");
        })
        .catch(() => showAlert("error", "Failed to update menu item"));
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setUploadImage(true);
    const image = await uploadImageToCloudinary(file);
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadImage(false);
  };

  const handleRemoveImage = (index) => {
    const updated = [...formik.values.images];
    updated.splice(index, 1);
    formik.setFieldValue("images", updated);
  };

  return (
    <div className="py-10 px-5 lg:flex items-center justify-center min-h-screen">
      <div className="lg:max-w-4xl">
        <h1 className="font-bold text-2xl text-center py-5">Edit Menu Item</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Grid container spacing={2}>
            <Grid className="flex flex-wrap gap-5" item xs={12}>
              <input
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                id="fileInput"
                onChange={handleImageChange}
              />
              <label htmlFor="fileInput" className="relative">
                <span className="w-24 h-24 cursor-pointer flex items-center justify-center border p-3 rounded-md">
                  <AddPhotoAlternate />
                </span>
                {uploadImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CircularProgress />
                  </div>
                )}
              </label>
              {formik.values.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt="food"
                    className="w-24 h-24 object-cover"
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(i)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      outline: "none",
                      color: "white",
                    }}
                    size="small"
                  >
                    <CloseIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              ))}
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                label="Name"
                {...formik.getFieldProps("name")}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                label="Price"
                {...formik.getFieldProps("price")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                {...formik.getFieldProps("description")}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  label="Category"
                >
                  {restaurant?.categories?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel>Is Vegetarian</InputLabel>
                <Select
                  name="vegetarian"
                  value={formik.values.vegetarian}
                  onChange={formik.handleChange}
                  label="Is Vegetarian"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Update Menu Item
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => navigate("/admin/restaurant/menu")}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};
