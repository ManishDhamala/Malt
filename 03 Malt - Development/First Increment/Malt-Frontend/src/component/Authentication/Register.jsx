import React, { useState } from "react";
import {
  Button,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { registerUser } from "../State/Authentication/Action";
import { useDispatch } from "react-redux";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  role: "ROLE_CUSTOMER",
};

// Yup Validation Schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Name should not contain numbers")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState(""); // State for backend error

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // const handleSubmit = (values) => {
  //   console.log("Form Values:", { ...values, password: "********" }); // This needs to be removed
  //   dispatch(
  //     registerUser({
  //       userData: values,
  //       navigate,
  //     })
  //   );
  // };

  const handleSubmit = async (values, { setSubmitting }) => {
    setRegisterError(""); // Reset previous errors
    console.log("Form Values:", { ...values, password: "********" }); // This needs to be removed

    try {
      const response = await dispatch(
        registerUser({
          userData: values,
          navigate,
        })
      );

      console.log("Register Response:", response); // ✅ This should now show a valid response

      if (response?.error) {
        setRegisterError(response.error);
      }
    } catch (error) {
      console.error("Register Error:", error);
      setRegisterError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Typography
        variant="h5"
        className="text-center"
        sx={{ color: "#B20303", fontWeight: "bold" }}
      >
        Create New Account
      </Typography>

      {/* 🔹 Show Error Alert at the Top */}
      {registerError && (
        <Alert severity="error" sx={{ my: 2 }}>
          {registerError}
        </Alert>
      )}

      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field
              as={TextField}
              name="fullName"
              label="Full Name"
              fullWidth
              variant="outlined"
              margin="normal"
              required
              error={touched.fullName && Boolean(errors.fullName)}
              helperText={<ErrorMessage name="fullName" />}
            />
            <Field
              as={TextField}
              name="email"
              label="Email"
              fullWidth
              variant="outlined"
              margin="normal"
              required
              error={touched.email && Boolean(errors.email)}
              helperText={<ErrorMessage name="email" />}
            />
            <Field
              as={TextField}
              name="password"
              label="Password"
              fullWidth
              variant="outlined"
              margin="normal"
              required
              error={touched.password && Boolean(errors.password)}
              helperText={<ErrorMessage name="password" />}
              type={showPassword ? "text" : "password"} // Toggle text/password type
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ pr: "1rem" }}>
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-simple-select-label">Role</InputLabel>
              <Field
                as={Select}
                labelId="role-simple-select-label"
                id="role-simple-select"
                name="role"
                label="Role"
                required
              >
                <MenuItem value={"ROLE_CUSTOMER"}>Customer</MenuItem>
                <MenuItem value={"ROLE_RESTAURANT_OWNER"}>
                  Restaurant Owner
                </MenuItem>
              </Field>
            </FormControl>
            <Button
              sx={{ mt: 1, padding: "1rem", borderRadius: "50px" }}
              fullWidth
              type="submit"
              variant="contained"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already Registered?
        <Button
          sx={{ color: "#B20303", fontWeight: "bold" }}
          size="small"
          onClick={() => navigate("/account/login")}
        >
          Login Now
        </Button>
      </Typography>
    </div>
  );
};
