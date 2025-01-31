import { Box, Modal } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Register } from "../Authentication/Register";
import { Login } from "../Authentication/Login";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  outline: "none",
  boxShadow: 24,
  p: 4,
};

export const Authentication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleOnClose = () => {
    navigate("/");
  };

  return (
    <>
      <Modal
        onClose={handleOnClose}
        open={
          location.pathname === "/account/register" ||
          location.pathname === "/account/login"
        }
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px", // Apply border-radius to text-field
          },
        }}
      >
        <Box sx={style}>
          {location.pathname === "/account/register" ? <Register /> : <Login />}
        </Box>
      </Modal>
    </>
  );
};
