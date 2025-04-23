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
import CenterLoader from "../Templates/CenterLoader";

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

const paymentOptions = [
  {
    value: "COD",
    label: "Cash on Delivery",
    logo: "https://png.pngtree.com/png-vector/20210528/ourmid/pngtree-cash-on-delivery-bagde-olshop-png-image_3381308.jpg",
  },
  {
    value: "STRIPE",
    label: "Stripe",
    logo: "data:image/jpeg;base64,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",
  },
  {
    value: "ESEWA",
    label: "E-Sewa",
    logo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxATEBAQERESEBIXFxUVGBYVFxUVFRIVFRYWFhUXFRYYHCghGBolHRUVITEhJS4rLi4vGB8/ODMsOigtLisBCgoKDg0OGxAQGzcmICY3LTAtLS4uKy0rKys3Ky0tLSstLSstLS0tLS0tLS0tLS0tLSstLS0tLS0tLSstLS0tLf/AABEIAOAA4AMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAYDBQcCAf/EAD4QAAIBAgEJBAgFAwMFAAAAAAABAgMRBAUGEiExUWFxgUGRobETIjJSYnLC0QcjQpLBQ6LhU9LwFBZjgvH/xAAZAQEAAwEBAAAAAAAAAAAAAAAAAgQFAwH/xAApEQEAAgICAgEDBAIDAAAAAAAAAQIDBBExEkEhFCJhEzJRUkJxYoGx/9oADAMBAAIRAxEAPwDuIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8VKiiryaSXa3ZI8mYjs6arE5zYSGr0im/gTl4rV4nC+1ir7cLbGOvtra2e1L9FGcvmcY+VzhO9X1DlO5X1CLLPeXZQiuc2/pIfX/8AFD638Ec959tCL5Tf+0fXz/U+s/CRRz2p/rozXyyUvOxON+vuEo3K+4bLDZ0YSer0mg9004+OzxO1drFPt2rsY59ttSqxklKLUlvTTXeixExPTtExPTIevQAAAAAAAAAAAAAAAAAAAI+NxtOlHTqSUFx7eCW1vkQtetI5mUbWiscyqWU88pO8aENFe/PW+kdi635FDJuz1SFLJt/0hWsXi6lR3qTlN/E725LYuhStktfuVS17W7lhIIAAAAAAZcNialN6VOcoPfF2vz39SVclq9SnW9q9SsmTM8ZxtGvHTXvRspdVsfSxdx7sx8Xhax7cx+9bcDj6VaOnSmprxXBp60+ZoUyVvHNZXq3reOYlKJpAAAAAAAAAAAAAAAADQZfzkhQvThapV3fph83Hh5FTPtRj+I+ZV82xFPiO1FxmMqVZadSTnLjsS3JbEjLvkteeZZt7zeeZYCCAAAAAAAAAAAZcLiZ05KdOThJdq8mu1cGSpktSeYlKl5rPMLzkDOaFa1OraFXs92fLc+HcauDai/xPbSw7EX+J7WItrIAAAAAAAAAAAAACrZ0ZxejvQov8zZKXucF8XkUdnZ8ftr2qbGx4/bXtSGzLZ0yB4AAAAAAAAAAAAAHL2JXLNbOPStQrv1tkJv8AV8Mnv3Pt57dLW2eftsv6+xz9tluNBdAAAAAAAAAAABoM6st+gh6OD/NmtXwR97n2L/BU2s/6ccR3KvsZvCOI7c+bMiZZcyB4AAAAD42OHr1Z7me+MnEvNzzg4fQ8AAAAAAB6vuaeW/Sx9FUf5sVqb/XFdvNdv/01tXP5x4z3DS183nHE9rGXFoAAAAAAAAAR8fi40qc6k/Zir89yXFuy6kL2ilZtKNrRWOZcux2LlVqSqT9qTvwS7EuCRh5Lze0zLHveb25lgIIAAABNyZkutXlanG6W2T1Rjzf8LWdceG2Sfh1x4rX6W3J+Z9GNnVk6st2uMe5a33mhj0qR+75XqalY/d8txTw+Go7I0qXSMfEsRXHT+Id+KVSqVWMleMlJcGn5E4mJ6SiYnpjr4OlNWnThP5op+Z5NKz3DyaxPcK/lXNClJOVB+il7ru4P+Y9O4q5dOtv2/Ctk1az+34UzFYadObhOLjJbU/Nb0Zl6TSeJZ96TWeJYiKIAAAAMuFxEqc41IO0ou6f34dnUlS80nmEq2ms8w6hkvGxrUoVY7Gta91rU0+TNzHeL1i0Nil4vWJhLOiYAAAAAAABSs+soXlDDxepevLm/ZXdd9UZu7l+YpCht5OqKoZ6iAAAG5zcyHLES0pXjSi9b7ZP3Y/yyzr6/6k8z0s4MHnPM9OgUqVOlBRiowhFckktbf+TXiIpHEdNKIisfCl5czpnNuFBunT2aS1Sny91ePLYZmfbmZ4p0oZtqZ+KK1J3d3re962+pTmZntUmeXujVlCSlCThJdsXZ96FbTWeYexaazzC95r5fddOlUt6VK99mnHfbeu3/AJbW1tj9T4ntpa+fz+J7WItrLT5x5GjiKeqyqxXqP6XwZX2MMZK/lxzYoyV/LnEotNpqzWpp7U1tRizHE8SyZjh8DwAAAAFmzHyho1ZUG/Vnrjwmlr70v7S9pZOLeE+13UycT4r0ajQAAAAAAAeKk1FOT1JJt8Etp5M8Ry8n4coxuJdSpOq9spOXJPYuisuhg5LedpljXt5WmWEggAAJGTsHKtVhSjtk9u5bW+iJ4sc3tFYdMdJvaIh1HB4aFKEacFaMVZfd8TdpWKRxDXrWKxxCtZ85RajDDxdtL1p/KnqXVp/tKW7l4jxhV28nEeMKWZjOAAGbBYl0qkKsdsWnzXauquupPHaaWiU8dvG0S6vTmmlJa01dcnsN6J5jlsxPPy9nr1Qs9snaFVVor1am3hNbe9eTMrdx8W8o9s7bx8W8o9q4UlMAAAAGTD1nCcZx9qLUlzTuSraazEwlWfGYmHV8NWU4RnH2ZJSXJq5vVtzHLarPMcspJ6AAAAABp87MRoYSrbbK0P3Oz8Llfat44pcNi3jjlzcxWSAAAFxzCwWqpXe32I8lZy+ldDR0cfxN2hp0+Jstxorrmmc+I08XWfYnoL/1Vn43MXat5ZZZOxbyyS1dyvw48JNDJ9efsUqkuKjK3fax0jFeeoTjFeeoT6ObGLl/S0PmlFeTbOsamWfTpGrkn02GGzLqtr0lWEV26N5Pxsdq6Nv8pda6c+5XShSUYxgtkUorklZGlEcRwvxHEcPZ69VvPetT/wCn0HJek0ouMe3i7brNlLctXw49qu1MeHHtRDKZgAAAAAHQszMRp4WK7YSlD6l4SXcbGpfyx/6autbnH/pvi0sAAAAAAVTP+r+XRhvm5ftjb6ihvT9sQp7k/bEKUZjOAAADpmbNDQwlFb46XWfrfybevXxxxDYwRxSG0O7q1kshYVzlN0YylJuT0rtXetuzdjjODHzzMOU4ac8zD16fCUdWlQpcE4R8Ee846fw95x1/hGrZ0YOP9Ry+WMn42sc7bWKPaFtnHHtAr560V7FKpLnoxXmzlO9T1DnO5X1CBXz1qv2KUI/M5S8rHGd+3qHKdy3qECtnRjJf1FD5Yx/lNnKdzLPtynaySgV8pV5+1WqS4aUrd17HKc17dy5zlvPcopz5QmQPAAOHsQHvEnEg4k4kPOJOJXH8P5u1ePZeD4Xekn11I0tDniYX9PniYW80F0AAAAACl/iBL1sOuFTzh9jN35/aobvpUzPUQAB8YHWcDG1Kkt0Iruijfp+2G3T9sJBNJyzLGInKvWUpSa9JNJNtpJSaSS7DDzXtN5+WPlvM3n5QrHFyAAAAAAAAAFs/D9LTxG+1Pznf+C/oR8yvafcrnY0uF4sOAsOHoej6AAAAAACl/iBH1sO+FRdzh9zN34/aobvpUzPUQAAYHVcl1NKhRlvpwffFG9jnmkNqk81hLOibmGcVDQxVdb5OX77S/kxNivGWWRsV4yS1xwcQAAAAAAAABbPw/a0sRvtT853/AINDQ7le0+5XO5orxcchccgOXr6egAAAAAFVz/pflUZ7puP7o3+kob0fbEqe5H2xKkmYzgAAA6NmhiNPCU12xvB8LPV4OJs6tvLFDW1reWOG6LLupmfmB9anXS1P1Jc1dx+ruRnb2Pq6juU6sqRnKAAAAAAAAAADl7EvrY5n+TmXw95k5kETJzK45gU3avPjCPddvzRo6PPEyv6fUyt5oLoAAAAAGnzsw+nhKttsbT/a7vwuV9qvlilw2K845c3MVkgAABasw8ZadWi/1LTXNapeFu40NG/zNV7Tv8zVdjSX0XKWDjWpTpS2SVr7ntTXJ2ZDJSL1msoXrF68S5di8NKnOVOatKLs/wCGuD2mFek0txLIvSazxLERQAAAABJydg5VqsKUdsnrfux/U+iOmLHN7REOmOk3twuOdmDoU8JqpwjJOMYNJJrXr18lI0dqlK4uv9L+xSlcfSimUzAAAAAdDzMw+hhYvtm5T+leEUbGpXxxx+WrrV4xw3paWAAAAAAPFSCknF60001vT2nkxzHDztyjG4Z06k6T2xk480tj6qz6mDkr4WmGNevjaYYSCAAAz4DFSpVYVY7Yu/NbGuquieO80tEwnjv4WiXVMNXjOEZxd4ySafBm7W0WjmGzWYtHMMpJ60Wc2QlXjpwsqsVqexTXuv8AhlXY14yRzHavnw/qRzHbn1WlKMnGScZLU09TTMi1ZrPEsyazWeJeTxEAAZMPQnOShCLnJ7Ev+alxJVrNp4hKtZtPEOg5uZDWHg3K0qsvafZFe7Hhx7e419fBGKPntqYMMY4/Ku565Q06qoxfq09vGb29y1dWU93L5W8Y9f8Aqrt5ObeMelcKSmAAAGTD0HOcKcfak1Fc27EqV8rREJUr5TEOr4eioQjCOyKUVySsjerHjHDaiOI4ZST0AAAAAABSs+snWlDERWp+pLmvZfVauiM3dx/MXhQ28fV1UM9RAAACzZoZbVN+gqO0JP1W9kJPsfB+fMvamfx+y3/S7rZuPtlejUaABrsqZHo11+ZH1tiktUl17VwZxyYa5O3PJirftWcVmXUT/Kqxkt004vvV7+BStoz/AIyp2059SirNDF/+L9z/ANpz+iyIfSXTsHmU73q1Ulugtf7pfY7U0f7S610/7Ss2T8mUaEbUoKO97ZPm3rZdx4q0jisLdMdaRxCHnJllYenaLTqyXqrd8T4LxOWxmjHX8uefLFI/LnMm222229bb2tva2Y0/LKmeXwPAAAAs+Y+TtKpKvJerD1Y8Zta30T/uL+li5nzld1MfM+a8mm0AAAAAAAACPjsJGrTnTn7Mlblua4p6+hC9YvXiUbVi0cS5djsJKlUlSn7UXbg12NcGjDyY5paYlj3pNLcSwEEAAAAsuQM6HTSp17zhsUtsoLc/eXjzL2Db8ftv1/K5h2uPiy6YXFU6kdKnJTjvTv37maVbRaOYX62i0cwzkkgAB8bPHivZazppUrxpWq1OGuEeb7eS8Crm2q0+K/Mq+XZrX4j5lRsViJ1JynOTlJ7W/JbkZV7zeebM295tPMsRFEAAAMuEw0qk404K8pOy+74Lb0JUpN7RWEqUm0+MOo5NwUaNKFKOyK273tbfNm5jpFKxWGxSkUrEQlHRMAAAAAAAAAaHOnInp4acF+bBavjj2x+3+Srs4P1I5jtX2MPnHMduetW1PU/Ix5jhlzHAHgAAAZMPiJwelCcoPfFtPrbaSreazzEpVtNepbjD52YuO2UKnzR1/wBtixXcyR+XeNu8JX/elf8A06X933On11v4dPrLfwxVM8cU9ipR5Rk34yIzu5PSM7l2rxuVsRV1VKspLdsj+1WTOF8+S/cuNs17dyhHJyAAAAAEPYhfs08iehj6WovzZLZ7kd3N9pr6uDwjme5aevh8I5ntYi2sgAAAAAAAAAAAq+c+bvpL1qK/M2yj/qcV8XmUdnW8/ur2qbGv5fdXtSGranqeyz2oy5iYZ0w+B4AAAAAAAAAAAAAD2IXXNfNzQ0a9ZevthB/o+KXxcOzns09bW8fut20NfX8fustZfXAAAAAAAAAAAAAAGiy/m5CvecbU6u/snwn9/Mq59auT5jtXza8X+Y7UTHYKpSnoVIuL8Gt8X2oysmO1J4mGbfHak8SjkEAAAAAAAAAAAzYPCVKslCnFzluXZxb7FxZOmO154hOtJvPEL1kDNqFG1SpapV7Pdh8u98fI1MGrGP5n5lo4deKfM9rAW1kAAAAAAAAAAAAAAAAYMXhKdWOhUipx3PzW58SFqRaOJhG1YtHEqnlTM1q8sPK69ye3pL795RyaXuink1P6qzjMFVpO1WEoPitT5PY+hRvjtTuFO+O1e4YCCAAAAAAGbC4WpUejThKb+FXtzexdSdMdrdQnWlrdQsmTMzpu0q8tBe7HXLrLYuly5j0p7vK3j1J/zW3BYGnSjoU4KC4bXxb2t8zQpStI4iF2tIrHEJJNIAAAAAAAAAAAAAAAAAAADzOCas0mtz1o8mOe3jU4rNrCT1+iUHvg3HwWrwOFtbFb05W18dvTW1syaX6K04/Moy8rHCdGvqXGdOvqUWWZEuyvHrBr6iH0H/JD6L8kcyJ9tePSDf1D6Cf7H0f5SaOZNP8AXWm/ljGPncnGhX3Kcadfctlhc2MJDX6PTfxty8Nngd66uKvp1rr449NtTpqKtFKK3JWS6I7xER07RER09nr0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z",
  },
  {
    value: "KHALTI",
    label: "Khalti",
    logo: "data:image/png;base64,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",
  },
];

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

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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
          success_url: `http://localhost:5173/payment/esewa/success/${res.order.id}`,
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
        // window.location.href = `/payment/success/${res.order?.id || res.id}`;
        setIsPlacingOrder(true);
        setTimeout(() => {
          window.location.href = `/payment/success/${res.order?.id || res.id}`;
        }, 500); // Add small delay to show loader
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
        window.location.href = res.payment_url;
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
          success_url: `http://localhost:5173/payment/esewa/success/${res.order.id}`,
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
        // COD
        // window.location.href = `/payment/success/${res.id}`;
        setIsPlacingOrder(true);
        setTimeout(() => {
          window.location.href = `/payment/success/${res.order?.id || res.id}`;
        }, 500); // Add small delay to show loader
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

  if (isPlacingOrder && paymentMethod === "COD") {
    return <CenterLoader message="Placing your order..." />;
  }

  return (
    <>
      <main className="lg:flex justify-between mt-16">
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
          {/*  Payment Method Radio Group */}
          <div className="px-4 py-4 mb-4">
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
                      label="Postal Code(Optional)"
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
                      label="Landmark (Optional)"
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
