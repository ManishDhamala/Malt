import React, { useState } from "react";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAlert } from "../Templates/AlertProvider";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AddressCard = ({
  item,
  showButton,
  handleSelectAddress,
  cart,
  showAlert,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirm = () => {
    handleCloseDialog();
    if (!cart?.cartItems?.length) {
      showAlert("error", "Your cart is empty");
      return;
    }
    handleSelectAddress(item);
  };

  return (
    <>
      <Card className="flex gap-5 w-64 p-5 shadow-md border border-gray-200">
        <LocationOnIcon />
        <div className="space-y-3 text-gray-700">
          <h1 className="font-semibold text-lg text-black">
            {item?.streetAddress}
          </h1>
          <p>
            {item?.streetAddress}, {item?.landmark && `${item?.landmark}, `}
            {item?.postalCode && `${item?.postalCode}, `}
            {item?.city}, {item?.province}, {item?.country}
          </p>
          {showButton && (
            <Button variant="contained" fullWidth onClick={handleOpenDialog}>
              Select
            </Button>
          )}
        </div>
      </Card>

      {/* Slide-in Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="confirm-address-dialog-description"
      >
        <DialogTitle>{"Confirm your delivery address"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-address-dialog-description">
            Are you sure you want to deliver to this address?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined" color="error">
            No
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="success">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
