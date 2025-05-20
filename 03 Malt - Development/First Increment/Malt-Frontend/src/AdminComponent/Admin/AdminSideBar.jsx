import {
  Dashboard,
  ShoppingBag,
  RestaurantMenu,
  Category,
  Event,
  AdminPanelSettings,
  Logout,
} from "@mui/icons-material";
import { Drawer, useMediaQuery, Divider } from "@mui/material";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../component/State/Authentication/Action";
import ReviewsIcon from "@mui/icons-material/Reviews";

const menu = [
  { title: "Dashboard", icon: <Dashboard />, path: "/" },
  { title: "Orders", icon: <ShoppingBag />, path: "/orders" },
  { title: "Menu", icon: <RestaurantMenu />, path: "/menu" },
  { title: "Food Category", icon: <Category />, path: "/category" },
  { title: "Events", icon: <Event />, path: "/event" },
  {
    title: "Restaurant Details",
    icon: <AdminPanelSettings />,
    path: "/details",
  },
  { title: "Reviews", icon: <ReviewsIcon />, path: "/reviews" },
  { title: "Logout", icon: <Logout /> },
];

export const AdminSideBar = ({ handleClose }) => {
  const isSmallScreen = useMediaQuery("(max-width:1080px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleNavigate = (item) => {
    if (item.title === "Logout") {
      dispatch(logout());
      navigate("/");
      handleClose();
    } else {
      navigate(`/admin/restaurant${item.path}`);
    }
  };

  // To highlight the selected side menu
  const getActiveClass = (path) => {
    const fullPath = `/admin/restaurant${path}`;
    return location.pathname === fullPath ||
      (path === "/" && location.pathname === "/admin/restaurant")
      ? "bg-blue-100 text-blue-600 font-semibold"
      : "text-gray-700 hover:bg-gray-100";
  };

  return (
    <Drawer
      variant={isSmallScreen ? "temporary" : "permanent"}
      onClose={handleClose}
      open={true}
      anchor="left"
      sx={{ zIndex: 1 }}
    >
      <div className="w-[70vw] lg:w-[20vw] h-screen flex flex-col justify-start  text-base">
        {menu.map((item, i) => (
          <React.Fragment key={i}>
            <div
              onClick={() => handleNavigate(item)}
              className={`flex items-center gap-4 px-7 py-4 cursor-pointer rounded-md transition-all duration-200 ${getActiveClass(
                item.path
              )}`}
            >
              <span className="text-[1.5rem]">{item.icon}</span>
              <span>{item.title}</span>
            </div>
            {i !== menu.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>
    </Drawer>
  );
};
