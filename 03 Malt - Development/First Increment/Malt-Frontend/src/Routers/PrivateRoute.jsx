// PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const PrivateRoute = ({ children, allowedRoles }) => {
  const jwt = localStorage.getItem("jwt");
  const { auth } = useSelector((store) => store);

  const role = auth?.user?.role;

  if (!jwt) return <Navigate to="/account/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
