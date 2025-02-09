import { Divider, IconButton } from "@mui/material";
import React from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export const CartItem = () => {
  return (
    <div className="px-5">
      <div className="lg:flex items-center lg:space-x-5">
        <div>
          <img
            className="w-[5rem] h-[5rem] object-cover"
            src="https://images.pexels.com/photos/28445587/pexels-photo-28445587/free-photo-of-delicious-fried-veg-momos-with-sauce-on-marble-surface.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="food-image"
          />
        </div>
        <div className="flex items-center justify-between lg:w-[70%]">
          <div className="space-y-1 lg:space-y-3 w-full">
            <p>Momo</p>
            <div className=" flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <IconButton>
                  <RemoveCircleOutlineIcon
                    sx={{ fontSize: "1.5rem", color: "#B20303" }}
                  />
                </IconButton>
                <div className="w-5 h-5 flex items-center justify-center">
                  {5}
                </div>
                <IconButton>
                  <AddCircleOutlineIcon
                    sx={{ fontSize: "1.5rem", color: "#B20303" }}
                  />
                </IconButton>
              </div>
            </div>
          </div>
          <p className="whitespace-nowrap">Rs 220</p>
        </div>
      </div>
      {/* <div className="ingredeints"></div> */}
    </div>
  );
};
