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
import { Field, Form, Formik } from "formik";
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

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (values) => {
    console.log("Form Values:", { ...values, password: "********" }); // This needs to be removed
    dispatch(
      registerUser({
        userData: values,
        navigate,
      })
    );
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

      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        <Form>
          <Field
            as={TextField}
            name="fullName"
            label="Full Name"
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <Field
            as={TextField}
            name="email"
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <Field
            as={TextField}
            name="password"
            label="Password"
            fullWidth
            variant="outlined"
            margin="normal"
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
