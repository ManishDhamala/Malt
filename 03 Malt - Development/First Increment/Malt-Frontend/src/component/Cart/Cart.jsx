import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Modal,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CartItem } from "./CartItem";
import { AddressCard } from "./AddressCard";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../State/store";
import { createOrder } from "../State/Order/Action";
// import * as Yup from "yup";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  outline: "none",
  boxShadow: 24,
  p: 4,
};

const initialValues = {
  landmark: "",
  streetAddress: "",
  province: "",
  postalCode: "",
  country: "",
  city: "",
};

// const validationSchema = Yup.object.shape({
//   streetAddress: Yup.string().required("Street address is required"),
//   province: Yup.string().required("Province is required"),
//   country: Yup.string().required("Country is required"),
//   city: Yup.string().required("City is required"),
// });

export const Cart = () => {
  const createOrderUsingSelectedAddress = () => {};
  const handleOpenAddressModal = () => setOpen(true);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const { cart, auth } = useSelector((store) => store);

  const dispatch = useDispatch();

  const handleSubmit = (values, { resetForm }) => {
    const data = {
      jwt: localStorage.getItem("jwt"),
      order: {
        restaurantId: cart.cartItems[0].food?.restaurant.id,
        deliveryAddress: {
          fullName: auth.user?.fullName,
          streetAddress: values.streetAddress,
          city: values.city,
          country: values.country,
          province: values?.province,
          postalCode: values.postalCode,
          landmark: values?.landmark,
        },
      },
    };
    dispatch(createOrder(data));
    console.log("Address Form Value", values);

    resetForm();

    handleClose();
  };

  const deliveryFee = 100;
  const restaurantCharges = 10;

  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  //  Refresh bill details when cart updates
  // **Recalculate total when cartItems change**
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

  return (
    <>
      <main className="lg:flex justify-between lg:mt-16">
        <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
          {cart?.cartItems?.length > 0 ? (
            cart.cartItems.map((item) => <CartItem key={item.id} item={item} />)
          ) : (
            <p className="text-center text-gray-800">Your cart is empty</p>
          )}

          <Divider />
          <div className="billDetails px-5 text-sm">
            <p className="font-bold py-5 underline">Bill Details:</p>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-900">
                <p>Subtotal</p>
                <p>Rs {subtotal}</p>
              </div>

              <div className="flex justify-between text-gray-900">
                <p>Delivery Fee</p>
                <p>Rs {deliveryFee}</p>
              </div>

              <div className="flex justify-between text-gray-900">
                <p>Restaurant Charges</p>
                <p>Rs {restaurantCharges}</p>
              </div>
              <Divider />
            </div>
            <div className="flex justify-between text-gray-900 font-bold pt-3">
              <p>Total Amount</p>
              <p>Rs {totalAmount}</p>
            </div>
          </div>
        </section>
        <Divider orientation="vertical" flexItem />
        <section className="lg:w-[70%] flex justify-center px-5 pb-10">
          <div>
            <h1 className="text-center font-semibold text-2xl py-8">
              <LocalShippingIcon sx={{ fontSize: 32 }} />
              <span className="ml-2">Choose Delivery Address</span>
            </h1>
            <div className="flex gap-5 flex-wrap justify-center">
              {[1, 1, 1, 1, 1].map((item) => (
                <AddressCard
                  handleSelectAddress={createOrderUsingSelectedAddress}
                  item={item}
                  showButton={true}
                />
              ))}
              <Card className="flex gap-5 w-64 p-5">
                <AddLocationAltIcon />
                <div className="space-y-3 text-gray-700 ">
                  <h1 className="font-semibold text-lg text-black">
                    Add New Address
                  </h1>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleOpenAddressModal}
                  >
                    + Add
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2
            className="text-center font-semibold text-3xl mb-4"
            style={{ color: "#B20303" }}
          >
            Delivery Address
          </h2>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            // validationSchema={validationSchema}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="country"
                    label="Country"
                    fullWidth
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="province"
                    label="Province"
                    fullWidth
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    name="city"
                    label="City"
                    fullWidth
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    name="postalCode"
                    label="Postal Code"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="streetAddress"
                    label="Street Address"
                    fullWidth
                    variant="outlined"
                    required
                    // error={!ErrorMessage("streetAddress")}
                    // helperText={
                    //   <ErrorMessage>
                    //     {(msg) => <span className="text-red-600">{msg}</span>}
                    //   </ErrorMessage>
                    // }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="landmark"
                    label="Landmark"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    color="primary"
                  >
                    Deliver Here
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </>
  );
};
