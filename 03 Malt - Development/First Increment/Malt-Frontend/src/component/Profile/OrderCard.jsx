import { Button, Card } from "@mui/material";
import React from "react";

export const OrderCard = () => {
  return (
    <Card className="flex justify-between items-center p-5 shadow-md border border-gray-300 ">
      <div className="flex items-center space-x-5">
        <img
          className="h-16 w-16"
          src="https://images.pexels.com/photos/3926135/pexels-photo-3926135.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="food-image"
        />
        <div>
          <p>Chowmein</p>
          <p>Rs 200</p>
        </div>
      </div>
      <Button variant="contained" className="cursor-not-allowed">
        Completed
      </Button>
    </Card>
  );
};
