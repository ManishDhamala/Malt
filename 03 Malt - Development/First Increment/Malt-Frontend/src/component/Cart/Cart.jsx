import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Modal,
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CartItem } from "./CartItem";
import { AddressCard } from "./AddressCard";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../State/Order/Action";
import { getSavedAddresses } from "../State/Address/Action";
import { HomeFooter } from "../Home/HomeFooter";
import { useAlert } from "../Templates/AlertProvider";

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

export const Cart = () => {
  const handleOpenAddressModal = () => setOpen(true);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const { showAlert } = useAlert();

  const { cart, auth, address } = useSelector((store) => store);

  const dispatch = useDispatch();

  const [saveAddress, setSaveAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleSaveAddressChange = (event) => {
    setSaveAddress(event.target.checked);
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (!cart?.cartItems?.length) {
      showAlert("error", "Your cart is empty");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

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
          savedAddress: saveAddress,
        },
        paymentMethod: paymentMethod,
      },
    };

    try {
      const res = await dispatch(createOrder(data));

      if (res.paymentUrl) {
        // Stripe OR Khalti
        window.location.href = res.paymentUrl;
      } else if (res.paymentProvider === "KHALTI") {
        window.location.href = res.payment_url; // ← Add this check (optional if you unify both above)
      } else if (res.paymentProvider === "ESEWA") {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        const fields = {
          amount: res.order.totalPrice,
          tax_amount: 0,
          total_amount: res.order.totalPrice,
          transaction_uuid: "ORD-" + res.order.id,
          product_code: "EPAYTEST",
          product_service_charge: 0,
          product_delivery_charge: 0,
          success_url: `http://localhost:5173/payment/success/${res.order.id}`,
          failure_url: `https://developer.esewa.com.np/failure`,
          signed_field_names: res.signedFieldNames, //  Provided by backend response
          signature: res.signature, //  Provided by backend response
        };

        for (const key in fields) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = fields[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      } else {
        // COD fallback
        window.location.href = `/payment/success/${res.order?.id || res.id}`;
      }

      resetForm();
      setSaveAddress(false);
      handleClose();
    } catch (error) {
      console.error("Order failed", error);
      alert("Order could not be processed. Please try again.");
    }
  };

  const createOrderUsingSelectedAddress = async (address) => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const data = {
      jwt: localStorage.getItem("jwt"),
      order: {
        restaurantId: cart.cartItems[0].food?.restaurant.id,
        addressId: address.id,
        paymentMethod: paymentMethod,
      },
    };

    try {
      const res = await dispatch(createOrder(data));

      if (res.paymentUrl) {
        // Stripe OR Khalti
        window.location.href = res.paymentUrl;
      } else if (res.paymentProvider === "KHALTI") {
        window.location.href = res.payment_url; // ← Add this check (optional if you unify both above)
      } else if (res.paymentProvider === "ESEWA") {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        const fields = {
          amount: res.order.totalPrice,
          tax_amount: 0,
          total_amount: res.order.totalPrice,
          transaction_uuid: "ORD-" + res.order.id,
          product_code: "EPAYTEST",
          product_service_charge: 0,
          product_delivery_charge: 0,
          success_url: `http://localhost:5173/payment/success/${res.order.id}`,
          failure_url: `http://localhost:5173/payment/fail`,
          signed_field_names: res.signedFieldNames, //  Provided by backend
          signature: res.signature, // Provided by backend
        };

        console.log("Esewa fields: ", fields);

        for (const key in fields) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = fields[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      } else {
        window.location.href = `/payment/success/${res.id}`;
      }
    } catch (error) {
      console.error("Order failed", error);
      alert("Order could not be processed. Please try again.");
    }
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(getSavedAddresses(jwt));
  }, []);

  useEffect(() => {
    if (cart?.cartItems?.length > 0) {
      const newSubtotal = cart.cartItems.reduce(
        (sum, item) => sum + item.food.price * item.quantity,
        0
      );
      setSubtotal(newSubtotal);
      setTotalAmount(newSubtotal + 100 + 10);
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
                <p>Rs 100</p>
              </div>

              <div className="flex justify-between text-gray-900">
                <p>Restaurant Charges</p>
                <p>Rs 10</p>
              </div>
              <Divider />
            </div>
            <div className="flex justify-between text-gray-900 font-bold pt-3">
              <p>Total Amount</p>
              <p>Rs {totalAmount}</p>
            </div>
          </div>

          <Divider />
          {/* ✅ Payment Method Radio Group */}
          {/* <div className="px-4 py-4">
            <FormControl component="fieldset" fullWidth>
              <p className="  mb-2 font-medium ">Select a payment method:</p>
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                {paymentOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-1 border rounded-2xl cursor-pointer transition ${
                      paymentMethod === option.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <Radio
                      checked={paymentMethod === option.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      value={option.value}
                      icon={
                        <span className="w-5 h-5 border border-gray-400 rounded-full" />
                      }
                      checkedIcon={
                        <CheckCircleIcon className="text-blue-600" />
                      }
                    />
                    <img
                      src={option.logo}
                      alt={option.label}
                      className="w-6 h-6 object-contain ml-2"
                    />
                    <span className="font-medium text-m ml-3">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </FormControl>
          </div> */}

          {/* ✅ Payment Method Radio Group - YT */}
          <div className="px-5 py-5">
            <FormControl component="fieldset">
              <FormLabel component="legend" className="font-semibold text-lg">
                Select Payment Method
              </FormLabel>
              <RadioGroup
                row
                aria-label="payment-method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="COD"
                  control={<Radio />}
                  label="Cash On Delivery"
                />
                <FormControlLabel
                  value="STRIPE"
                  control={<Radio />}
                  label="Stripe"
                />
                <FormControlLabel
                  value="ESEWA"
                  control={<Radio />}
                  label="eSewa"
                />
                <FormControlLabel
                  value="KHALTI"
                  control={<Radio />}
                  label="Khalti"
                />
              </RadioGroup>
            </FormControl>
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
              {address.savedAddresses
                .sort((a, b) => b.id - a.id)
                .map((item, index) => (
                  <AddressCard
                    key={index}
                    handleSelectAddress={createOrderUsingSelectedAddress}
                    item={item}
                    showButton={true}
                    cart={cart}
                    showAlert={showAlert}
                  />
                ))}
              <Card className="flex gap-5 w-64 p-5">
                <AddLocationAltIcon />
                <div className="space-y-3 text-gray-700">
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

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h2
            className="text-center font-semibold text-3xl mb-4"
            style={{ color: "#B20303" }}
          >
            Delivery Address
          </h2>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
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
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={saveAddress}
                          onChange={handleSaveAddressChange}
                          color="primary"
                        />
                      }
                      label="Save this address for future orders"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Deliver Here"}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
      <HomeFooter />
    </>
  );
};
