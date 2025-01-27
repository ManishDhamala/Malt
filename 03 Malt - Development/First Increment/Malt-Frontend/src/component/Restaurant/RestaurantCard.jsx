import { Card, Chip, IconButton } from "@mui/material";
import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export const RestaurantCard = () => {
  return (
    <Card className="m-2 w-[18rem]">
      <div
        className={`${true ? "cursor-pointer" : "cursor-not-allowed"} relative`}
      >
        <img
          className="w-full h-[10rem] rounded-t-md object-cover"
          src="https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <Chip
          size="small"
          className="absolute top-2 left-2"
          color={true ? "success" : "error"}
          label={true ? "open" : "closed"}
        />
      </div>
      <div className="p-4 textPart lg:flex w-full justify-between">
        <div className="space-y-1">
          <p className="text-gray-700 font-semibold text-lg">
            Dream High Restaurant
          </p>
          <p className="text-gray-700 text-sm">
            Craving for food ? Just come in.
          </p>
        </div>
        <div>
          <IconButton>
            {true ? (
              <FavoriteIcon sx={{ fontSize: "1.6rem", color: "#d91a1a" }} />
            ) : (
              <FavoriteBorderIcon
                sx={{ fontSize: "1.6rem", color: "#242b2E" }}
              />
            )}
          </IconButton>
        </div>
      </div>
    </Card>
  );
};
