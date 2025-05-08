import React, { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, clearCart, findCart } from "../State/Cart/Action";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Templates/AlertProvider";
import { CartResetDialog } from "./CartResetDialog";

export const MenuCard = ({ item }) => {
  const dispatch = useDispatch();
  const { auth, cart } = useSelector((store) => store);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  // Function to check if cart has items from different restaurant
  const isFromDifferentRestaurant = () => {
    // Make sure we have cart items and the current item has restaurant info
    if (
      !cart.cartItems ||
      cart.cartItems.length === 0 ||
      !item.restaurant?.id
    ) {
      return false;
    }

    // Check the first item's restaurant ID against current item's restaurant ID
    const firstCartItem = cart.cartItems[0];

    // Early return if the first item doesn't have food or restaurant data
    if (!firstCartItem.food || !firstCartItem.food.restaurant) {
      return false;
    }

    // Compare restaurant IDs
    return firstCartItem.food.restaurant.id !== item.restaurant.id;
  };

  const handleAddItemToCart = () => {
    // First check if user is logged in
    if (!auth?.user) {
      navigate("/account/login");
      return;
    }

    // Check if cart has items from a different restaurant
    if (
      cart.cartItems &&
      cart.cartItems.length > 0 &&
      isFromDifferentRestaurant()
    ) {
      // Save the item for later if user confirms
      setPendingItem({
        foodId: item.id,
        quantity: 1,
      });
      // Show the confirmation dialog
      setDialogOpen(true);
    } else {
      // Same restaurant or empty cart, proceed normally
      addItemToCartDirectly({
        foodId: item.id,
        quantity: 1,
      });
    }
  };

  const addItemToCartDirectly = (cartItem) => {
    const reqData = {
      jwt: localStorage.getItem("jwt"),
      cartItem: cartItem,
    };
    dispatch(addItemToCart(reqData));
    showAlert("success", "Food item added to cart");
  };

  const handleDialogConfirm = async () => {
    // First clear the cart
    await dispatch(clearCart());

    // Then add the new item
    if (pendingItem) {
      // Wait a short moment for the cart to clear before adding the new item
      setTimeout(() => {
        addItemToCartDirectly(pendingItem);
        setPendingItem(null);
      }, 300);
    }

    setDialogOpen(false);
  };

  const handleDialogClose = () => {
    setPendingItem(null);
    setDialogOpen(false);
  };

  // Use effect to fetch cart data when component mounts
  useEffect(() => {
    if (auth?.user) {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        dispatch(findCart(jwt));
      }
    }
  }, [auth?.user, dispatch]);

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2 sm:gap-3 lg:gap-4 shadow-md border border-gray-200 rounded-md p-2 sm:p-3 lg:p-4 bg-white w-full max-w-2xl mx-auto relative transition-transform hover:scale-103">
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

        <IconButton
          onClick={handleAddItemToCart}
          className="absolute top-4 lg:top-11 right-1 transform -translate-y-1/2"
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

      {/* Confirmation Dialog */}
      <CartResetDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />
    </>
  );
};
