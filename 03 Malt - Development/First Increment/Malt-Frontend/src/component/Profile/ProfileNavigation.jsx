import React from "react";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import LogoutIcon from "@mui/icons-material/Logout";
import { Divider, Drawer, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../State/Authentication/Action";

const menu = [
  { title: "Profile", icon: <PersonIcon /> },
  { title: "Orders", icon: <ShoppingBagIcon /> },
  { title: "Favorites", icon: <FavoriteIcon /> },
  { title: "Address", icon: <LocationOnIcon /> },
  { title: "Payment", icon: <PaymentsIcon /> },
  // { title: "Notifications", icon: <NotificationsActiveIcon /> },
  { title: "Events", icon: <EventIcon /> },
  { title: "Logout", icon: <LogoutIcon /> },
];

export const ProfileNavigation = ({ open, handleClose }) => {
  const isSmallScreen = useMediaQuery("(max-width: 900px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleNavigate = (item) => {
    if (item.title === "Logout") {
      dispatch(logout());
      navigate("/");
    } else if (item.title === "Profile") {
      navigate("/my-profile/");
    } else {
      navigate(`/my-profile/${item.title.toLowerCase()}`);
    }
  };

  const getActiveClass = (title) => {
    const path =
      title === "Profile"
        ? "/my-profile"
        : `/my-profile/${title.toLowerCase()}`;

    return location.pathname === path
      ? "bg-blue-100 text-blue-600 font-semibold"
      : "text-gray-700 hover:bg-gray-100";
  };

  return (
    <div>
      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        onClose={handleClose}
        open={open}
        anchor="left"
      >
        <div className="w-[50vw] lg:w-[20vw] h-full flex flex-col justify-start text-base pt-17">
          {menu.map((item, i) => (
            <React.Fragment key={i}>
              <div
                onClick={() => handleNavigate(item)}
                className={`w-full flex items-center gap-4 px-6 py-4 cursor-pointer rounded-md transition-all duration-200 ${getActiveClass(
                  item.title
                )}`}
              >
                <span className="text-[1.5rem]">{item.icon}</span>
                <span>{item.title}</span>
              </div>
              {i !== menu.length - 1 && <Divider className="w-full" />}
            </React.Fragment>
          ))}
        </div>
      </Drawer>
    </div>
  );
};
