import { Avatar, Badge, IconButton } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../State/store";

export const Navbar = () => {
  const { auth } = useSelector((store) => store);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (auth?.user) {
      if (auth.user.role === "ROLE_CUSTOMER") {
        navigate("/my-profile");
      } else {
        navigate("/admin/restaurant");
      }
    } else {
      navigate("/account/login");
    }
  };

  return (
    <div className="px-5 z-50 py-[.8rem] bg-[#B20303] lg:px-20 flex justify-between">
      <div className="lg:mr-10 cursor-pointer flex items-center space-x-4">
        <li
          onClick={() => navigate("/")}
          className="logo font-semibold text-white text-2xl"
        >
          Malt
        </li>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-10">
        <div className="">
          <IconButton>
            <SearchIcon sx={{ fontSize: "1.6rem", color: "white" }} />
          </IconButton>
        </div>
        {/* <div className="">
          <Avatar sx={{ bgcolor: "white", color: "#B20303" }}>M</Avatar>
        </div> */}
        <div className="">
          <IconButton>
            <Badge color="secondary" badgeContent={3}>
              <ShoppingCartIcon sx={{ fontSize: "1.6rem", color: "white" }} />
            </Badge>
          </IconButton>
        </div>
        <div className="">
          <IconButton onClick={handleProfileClick}>
            <PersonIcon sx={{ fontSize: "1.8rem", color: "white" }} />
          </IconButton>
        </div>
        <div className="">
          <IconButton>
            <Badge color="secondary" badgeContent={2}>
              <NotificationsIcon sx={{ fontSize: "1.6rem", color: "white" }} />
            </Badge>
          </IconButton>
        </div>
      </div>
    </div>
  );
};
