import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../State/Cart/Action";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const MenuCard = ({ item }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const navigate = useNavigate();

  const handleAddItemToCart = () => {
    if (auth?.user) {
      const reqData = {
        jwt: localStorage.getItem("jwt"),
        cartItem: {
          foodId: item.id,
          quantity: 1,
        },
      };
      dispatch(addItemToCart(reqData));
    } else {
      navigate("/account/login");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2 sm:gap-3 lg:gap-4 shadow-md border border-gray-200 rounded-md p-2 sm:p-3 lg:p-4 bg-white w-full max-w-2xl mx-auto relative">
      <img
        className="w-[4rem] h-[4rem] sm:w-[4.5rem] sm:h-[4.5rem] lg:w-[5.5rem] lg:h-[5.5rem] object-cover rounded-md"
        src={
          item.images[0] ||
          "https://via.placeholder.com/100x100.png?text=No+Image"
        }
        alt="food-image"
      />

      <div className="flex flex-col space-y-1 sm:space-y-1 lg:space-y-2 lg:max-w-lg flex-grow">
        <p className="font-semibold text-sm sm:text-base text-gray-800">
          {item.name}
        </p>
        <p className="text-xs sm:text-sm font-medium text-gray-800">
          Rs {item.price}
        </p>
        <p className="text-gray-700 text-xs sm:text-sm leading-snug line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Right-center positioned icon */}
      <IconButton
        onClick={handleAddItemToCart}
        className="absolute top-4 lg:top-11 right-3 transform -translate-y-1/2"
      >
        <AddCircleIcon
          sx={{
            fontSize: "1.5rem",
            color: "#0aa13e",
            cursor: "pointer",
            "&:hover": { color: "#42cf73" },
          }}
        />
      </IconButton>
    </div>
  );
};
