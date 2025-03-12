import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { loginUser } from "../State/Authentication/Action";

const initialValues = {
  email: "",
  password: "",
};

// Yup Validation Schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(""); // State for backend error

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError(""); // Reset previous errors

    try {
      const response = await dispatch(
        loginUser({
          userData: values,
          navigate,
        })
      );

      console.log("Login Response:", response); // ✅ This should now show a valid response

      if (response?.error) {
        setLoginError(response.error);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoginError("Something went wrong. Please try again.");
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
        Login to Malt
      </Typography>

      {/* 🔹 Show Error Alert at the Top */}
      {loginError && (
        <Alert severity="error" sx={{ my: 2 }}>
          {loginError}
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
              type={showPassword ? "text" : "password"} // Toggle text/password type
              error={touched.password && Boolean(errors.password)}
              helperText={<ErrorMessage name="password" />}
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

            <Button
              sx={{ mt: 2, padding: "1rem", borderRadius: "50px" }}
              fullWidth
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </Form>
        )}
      </Formik>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Not Registered?
        <Button
          sx={{ color: "#B20303", fontWeight: "bold" }}
          size="small"
          onClick={() => navigate("/account/register")}
        >
          Register Now
        </Button>
      </Typography>
    </div>
  );
};
