import { AddPhotoAlternate } from "@mui/icons-material";
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
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { uploadImageToCloudinary } from "../Util/UploadToCloudinary";

const initialValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  restaurantId: "",
  vegetarian: false,
  images: [],
};

export const CreateMenuForm = () => {
  const [uploadImage, setUploadImage] = useState(false);

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      values.restaurantId = 2;
      console.log("Data ---- ", values);
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
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  return (
    <div className="py-10 px-5 lg:flex items-center justify-center min-h-screen">
      <div className="lg:max-w-4xl">
        <h1 className="font-bold text-2xl text-center py-5">
          Add New Menu Item
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Grid container spacing={2}>
            <Grid className="flex flex-wrap gap-5" item xs={12}>
              <input
                accept="image/*"
                id="fileInput"
                type="file"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              <label className="relative" htmlFor="fileInput">
                <span
                  className="w-24 h-24 cursor-pointer flex items-center
               justify-center p-3 border rounded-md border-b-gray-600"
                >
                  <AddPhotoAlternate className="text-black" />
                </span>
                {uploadImage && (
                  <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                    <CircularProgress />
                  </div>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {formik.values.images.map((image, index) => (
                  <div className="relative">
                    <img
                      className="w-24 h-24 object-cover"
                      key={index}
                      src={image}
                      alt="food-image"
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        outline: "none",
                        color: "white",
                      }}
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <CloseIcon sx={{ fontSize: "1rem" }} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Price"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.openingHours}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Food Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formik.values.category}
                  label="Catgeory"
                  onChange={formik.handleChange}
                  name="category"
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Is Vegetarian
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="vegetarian"
                  value={formik.values.vegetarian}
                  label="Is Vegetarian"
                  onChange={formik.handleChange}
                  name="vegetarian"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button fullWidth variant="contained" color="primary" type="submit">
            Add Menu Item
          </Button>
        </form>
      </div>
    </div>
  );
};
