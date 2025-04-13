import { CircularProgress } from "@mui/material";
import React from "react";

const CenterLoader = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] gap-4">
      <CircularProgress color="primary" size={50} />
      <p className="text-gray-500 text-lg font-medium">{message}</p>
    </div>
  );
};

export default CenterLoader;
