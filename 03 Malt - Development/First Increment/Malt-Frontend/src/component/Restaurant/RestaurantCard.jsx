import { Card, Chip, IconButton } from "@mui/material";
import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorite } from "../State/Authentication/Action";
import { isPresentInFavourites } from "../config/logic";
import { store } from "../State/store";

export const RestaurantCard = ({ restaurant }) => {
  if (!restaurant) return null; //  Prevent rendering if restaurant is undefined

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { auth } = useSelector((store) => store);

  const handleAddToFavorite = () => {
    dispatch(addToFavorite({ restaurantId: restaurant.id, jwt }));
  };

  const handleNavigateToRestaurant = () => {
    if (restaurant.open) {
      navigate(
        `/restaurant/${restaurant.address.city}/${restaurant.name}/${restaurant.id}`
      );
    }
  };

  return (
    <Card className="m-2 w-[18rem]">
      <div
        className={`${
          restaurant.open ? "cursor-pointer" : "cursor-not-allowed"
        } relative`}
      >
        <img
          className="w-full h-[10rem] rounded-t-md object-cover"
          src={
            restaurant.images[0] ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv1ank-wR_C1doFKGVu5XKmO5bg6RTaVub5A&s"
          }
          alt={restaurant.name || restaurant.title || "Restaurant Image"}
        />
        <Chip
          size="small"
          className="absolute top-2 left-2"
          color={restaurant.open ? "success" : "error"}
          label={restaurant.open ? "open" : "closed"}
        />
      </div>
      <div className="p-4 textPart lg:flex w-full justify-between">
        <div className="space-y-1">
          <p
            onClick={handleNavigateToRestaurant}
            className="text-gray-700 font-semibold text-lg cursor-pointer"
          >
            {restaurant.name || restaurant.title || "Unknown Restaurant"}
          </p>
          <p className="text-gray-700 text-sm">
            {restaurant.description || "No description available"}
          </p>
        </div>
        <div>
          <IconButton onClick={handleAddToFavorite}>
            {isPresentInFavourites(auth.favourites, restaurant) ? (
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
