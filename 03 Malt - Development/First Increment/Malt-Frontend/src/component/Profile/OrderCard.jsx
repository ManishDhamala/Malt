import { Button, Card } from "@mui/material";
import React from "react";

export const OrderCard = ({ item, order }) => {
  return (
    <Card className="flex justify-between items-center p-5 shadow-md border border-gray-300 ">
      <div className="flex items-center space-x-5">
        <img
          className="h-16 w-16"
          src={item.food?.images[0]}
          alt="food-image"
        />
        <div>
          <p>{item.food?.name}</p>
          <p>Rs {item?.totalPrice}</p>
        </div>
      </div>
      <Button variant="contained" className="cursor-not-allowed">
        {order.orderStatus}
      </Button>
    </Card>
  );
};
