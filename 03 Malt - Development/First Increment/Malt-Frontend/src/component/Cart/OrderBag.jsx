import React, { useEffect, useState } from "react";
import {
  Card,
  Divider,
  IconButton,
  Typography,
  Button,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  removeCartItem,
  updateCartItem,
} from "../State/Cart/Action";
import { useNavigate } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useAlert } from "../Templates/AlertProvider";

export const OrderBag = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((store) => store);
  const navigate = useNavigate();

  const deliveryFee = 100;
  const restaurantCharges = 10;

  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const jwt = localStorage.getItem("jwt");

  const { showAlert } = useAlert();

  useEffect(() => {
    if (cart?.cartItems?.length > 0) {
      const newSubtotal = cart.cartItems.reduce(
        (sum, item) => sum + item.food.price * item.quantity,
        0
      );
      setSubtotal(newSubtotal);
      setTotalAmount(newSubtotal + deliveryFee + restaurantCharges);
    } else {
      setSubtotal(0);
      setTotalAmount(0);
    }
  }, [cart.cartItems]);

  const handleUpdateCartItem = (item, value) => {
    if (value === -1 && item.quantity === 1) {
      handleRemoveCartItem(item);
      return;
    }
    const data = { cartItemId: item.id, quantity: item.quantity + value };
    dispatch(updateCartItem({ data, jwt }));
  };

  const handleRemoveCartItem = (item) => {
    dispatch(removeCartItem({ cartItemId: item.id, jwt }));
    showAlert("error", "Food item removed from cart");
  };

  const handleCheckout = () => {
    navigate("/cart");
  };

  return (
    <div className="lg:block sticky top-28 w-80 overflow-y-auto max-h-[77vh] p-4 shadow-md bg-white rounded-lg border border-gray-200 pb-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        <span className="flex items-center justify-center gap-2">
          <ShoppingBagIcon className="w-5 h-5" />
          Order Bag
        </span>
      </h2>

      <Divider />
      <div className="mt-3 space-y-1">
        {cart?.cartItems?.length > 0 ? (
          cart.cartItems.map((item) => (
            <Card key={item.id} className="p-3 flex items-center gap-3">
              <img
                src={item.food.images[0]}
                alt={item.food.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div className="flex-grow">
                <Typography className="font-medium text-xs">
                  {item.food.name}
                </Typography>
                <Typography className="text-xs text-gray-600">
                  Rs {item.food.price} × {item.quantity}
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <IconButton
                  size="small"
                  onClick={() => handleUpdateCartItem(item, -1)}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleUpdateCartItem(item, 1)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </div>
            </Card>
          ))
        ) : (
          <Typography align="center" color="text.secondary">
            Your order bag is empty.
          </Typography>
        )}
      </div>

      {cart?.cartItems?.length > 0 && (
        <div className="text-sm mt-2">
          <Divider className="mb-4" />
          <Typography className="font-semibold pb-2 underline">
            Bill Summary:
          </Typography>
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p>Rs {subtotal}</p>
          </div>
          <div className="flex justify-between">
            <p>Delivery Fee:</p>
            <p>Rs {deliveryFee}</p>
          </div>
          <div className="flex justify-between">
            <p>Restaurant Charges:</p>
            <p>Rs {restaurantCharges}</p>
          </div>
          <Divider className="my-3" />
          <div className="flex justify-between font-bold">
            <p>Total:</p>
            <p>Rs {totalAmount}</p>
          </div>
          <Box mt={2}>
            <Button
              fullWidth
              variant="contained"
              size="small"
              color="primary"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
};
