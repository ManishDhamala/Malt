import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";

export const CartResetDialog = ({ open, onClose, onConfirm }) => {
  const { cart } = useSelector((store) => store);

  // Get the current restaurant name from the first item in the cart
  const getCurrentRestaurantName = () => {
    if (
      cart?.cartItems &&
      cart.cartItems.length > 0 &&
      cart.cartItems[0].food &&
      cart.cartItems[0].food.restaurant
    ) {
      return cart.cartItems[0].food.restaurant.name;
    }
    return "another restaurant";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid #e9ecef" }}
      >
        <Typography variant="h6" component="div">
          Reset Your Cart?
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 1 }}>
        <DialogContentText id="alert-dialog-description">
          You already have items from{" "}
          <strong>{getCurrentRestaurantName()}</strong> in your cart.
          <br />
          <br />
          Would you like to clear your current cart and add this new item
          instead?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: "1px solid #e9ecef" }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            color: "error",
            "&:hover": { backgroundColor: "#f1f3f5" },
          }}
        >
          Keep Current Cart
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: "#0aa13e",
            "&:hover": { backgroundColor: "#089235" },
          }}
          autoFocus
        >
          Clear Cart & Add Item
        </Button>
      </DialogActions>
    </Dialog>
  );
};
