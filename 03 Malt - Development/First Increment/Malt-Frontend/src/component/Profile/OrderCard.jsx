import { Button, Card } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
];

const formatDate = (isoString) => {
  if (!isoString) return ""; // Handle undefined values
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const OrderCard = ({ item, order }) => {
  console.log("Order Store: ", order);

  return (
    <Card className="flex flex-col md:flex-row justify-between items-center p-5 shadow-lg border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center space-x-4 w-full md:w-auto">
        <img
          className="h-20 w-20 object-cover rounded-lg"
          src={item.food?.images[0]}
          alt="food-image"
        />

        <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
          <h6 className="font-semibold text-lg">
            Restaurant: {order?.restaurant?.title || Unknown}
          </h6>
          <p className="text-gray-500">
            Order No: <span className="font-medium">#{order.id}</span>
          </p>
          <p className="text-gray-500">
            Date:{" "}
            <span className="font-medium">{formatDate(order?.createdAt)}</span>
          </p>
          <p className="font-medium">
            {item.food?.name}{" "}
            <span className="text-gray-500">x {item?.quantity}</span> =
            <span className="font-semibold"> Rs {item?.totalPrice}</span>
          </p>
          <p className="text-gray-500 mr-8">
            {order?.deliveryAddress?.streetAddress},{" "}
            {order?.deliveryAddress?.city}
          </p>
        </div>
      </div>

      <Button
        variant="contained"
        size="small"
        onClick={(event) => handleClick(event, item.id)}
        sx={{
          minWidth: "120px",
          textTransform: "capitalize",
          fontSize: "0.75rem",
          backgroundColor: "primary.main",
          color: "white",
        }}
      >
        {orderStatus.find((status) => status.value === order.orderStatus)
          ?.label || "Unknown"}
      </Button>
    </Card>
  );
};
