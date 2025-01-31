import { Card, Chip, IconButton } from "@mui/material";
import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export const RestaurantCard = ({ restaurant }) => {
  const { name, description, isOpen, image, isFavorite } = restaurant;

  return (
    <Card className="m-2 w-[18rem]">
      <div
        className={`${
          isOpen ? "cursor-pointer" : "cursor-not-allowed"
        } relative`}
      >
        <img
          className="w-full h-[10rem] rounded-t-md object-cover"
          src={image}
          alt={name}
        />
        <Chip
          size="small"
          className="absolute top-2 left-2"
          color={isOpen ? "success" : "error"}
          label={isOpen ? "open" : "closed"}
        />
      </div>
      <div className="p-4 textPart lg:flex w-full justify-between">
        <div className="space-y-1">
          <p className="text-gray-700 font-semibold text-lg">{name}</p>
          <p className="text-gray-700 text-sm">{description}</p>
        </div>
        <div>
          <IconButton>
            {isFavorite ? (
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
