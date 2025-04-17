// EditEventForm.jsx
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AddPhotoAlternate, Close as CloseIcon } from "@mui/icons-material";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { uploadImageToCloudinary } from "../Util/UploadToCloudinary";
import { updateEvent, getEventById } from "../../component/State/Event/Action";
import { useAlert } from "../../component/Templates/AlertProvider";
import dayjs from "dayjs";

const eventSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be later than start date"),
  images: Yup.array().min(1, "At least one image is required"),
});

export const EditEventForm = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const jwt = localStorage.getItem("jwt");
  const { event } = useSelector((store) => store);
  const { showAlert } = useAlert();
  const [uploadImage, setUploadImage] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      startDate: null,
      endDate: null,
      images: [],
    },
    validationSchema: eventSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        ...values,
      };
      try {
        await dispatch(updateEvent({ eventId, data, jwt }));
        showAlert("success", "Event updated successfully");
        navigate("/admin/restaurant/event");
        onSuccess?.();
      } catch (err) {
        console.error(err);
        showAlert("error", "Failed to update event");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (eventId) {
      dispatch(getEventById({ eventId, jwt }));
    }
  }, [eventId, dispatch, jwt]);

  useEffect(() => {
    if (event.currentEvent) {
      formik.setValues({
        title: event.currentEvent.title || "",
        description: event.currentEvent.description || "",
        startDate: event.currentEvent.startDate
          ? dayjs(event.currentEvent.startDate)
          : null,
        endDate: event.currentEvent.endDate
          ? dayjs(event.currentEvent.endDate)
          : null,
        images: event.currentEvent.images || [],
      });
    }
  }, [event.currentEvent]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadImage(true);
    try {
      const image = await uploadImageToCloudinary(file);
      formik.setFieldValue("images", [...formik.values.images, image]);
    } finally {
      setUploadImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updated = [...formik.values.images];
    updated.splice(index, 1);
    formik.setFieldValue("images", updated);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-18 border border-gray-300">
      <h1 className="font-bold text-xl mb-4 text-center">Edit Event</h1>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid className="flex flex-wrap gap-3" item xs={12}>
            <input
              accept="image/*"
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <label className="relative" htmlFor="fileInput">
              <span className="w-20 h-20 cursor-pointer flex items-center justify-center p-2 border rounded-md border-gray-400">
                <AddPhotoAlternate className="text-gray-700" />
              </span>
              {uploadImage && (
                <div className="absolute inset-0 w-20 h-20 flex justify-center items-center bg-white/70">
                  <CircularProgress size={24} />
                </div>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {formik.values.images.map((image, index) => (
                <div className="relative" key={index}>
                  <img
                    className="w-20 h-20 object-cover rounded"
                    src={image}
                    alt="event"
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "white",
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <CloseIcon sx={{ fontSize: "0.875rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
            {formik.touched.images && formik.errors.images && (
              <p className="text-red-500 text-sm w-full">
                {formik.errors.images}
              </p>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Event Title"
              variant="outlined"
              size="small"
              onChange={formik.handleChange}
              value={formik.values.title}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Event Description"
              variant="outlined"
              size="small"
              multiline
              rows={3}
              onChange={formik.handleChange}
              value={formik.values.description}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Start Date & Time"
              value={formik.values.startDate}
              onChange={(value) => formik.setFieldValue("startDate", value)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  error:
                    formik.touched.startDate &&
                    Boolean(formik.errors.startDate),
                  helperText:
                    formik.touched.startDate && formik.errors.startDate,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="End Date & Time"
              value={formik.values.endDate}
              onChange={(value) => formik.setFieldValue("endDate", value)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  error:
                    formik.touched.endDate && Boolean(formik.errors.endDate),
                  helperText: formik.touched.endDate && formik.errors.endDate,
                },
              }}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="space-between" gap={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={formik.isSubmitting}
          >
            Update Event
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => navigate("/admin/restaurant/event")}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </div>
  );
};
