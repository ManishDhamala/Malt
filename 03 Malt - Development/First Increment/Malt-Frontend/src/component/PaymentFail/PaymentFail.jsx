import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { red } from "@mui/material/colors";
import { Button, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const PaymentFail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-5 pt-16">
      <div className="flex flex-col items-center justify-center h-[90vh]">
        <Card className="box w-full lg:w-1/4 flex flex-col items-center rounded-md p-5 border border-gray-200 shadow-md">
          <ErrorOutlineIcon sx={{ fontSize: "5rem", color: red[900] }} />
          <h1 className="py-5 text-2xl font-semibold text-red-700">
            Payment Failed
          </h1>
          <p className="py-2 text-center text-gray-700">
            Oops! Something went wrong during the payment process.
          </p>
          <p className="py-2 text-center text-gray-900 text-lg">
            Please try again or contact support.
          </p>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            sx={{ margin: "1rem 0rem" }}
          >
            Go To Home
          </Button>
        </Card>
      </div>
    </div>
  );
};
