import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../State/Authentication/Action";

export const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center lg:mt-22">
      <div className="flex flex-col items-center justify-center ">
        <AccountCircleIcon sx={{ fontSize: "9rem" }} />
        <h1 className="py-5 text-2xl font-semibold">{auth.user?.fullName}</h1>
        <p>Email: {auth.user?.email}</p>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{ margin: "1.8rem 0rem" }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
