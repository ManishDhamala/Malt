import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { loginUser } from "../State/Authentication/Action";

const initialValues = {
  email: "",
  password: "",
};

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (values) => {
    dispatch(
      loginUser({
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
        Login to Malt
      </Typography>

      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        <Form>
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
          <Button
            sx={{ mt: 1, padding: "1rem", borderRadius: "50px" }}
            fullWidth
            type="submit"
            variant="contained"
          >
            Login
          </Button>
        </Form>
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
