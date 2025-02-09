import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import { Button, Card } from "@mui/material";

export const AddressCard = ({ item, showButton, handleSelectAddress }) => {
  return (
    <Card className="flex gap-5 w-64 p-5 shadow-md border border-gray-200 ">
      <HomeIcon />
      <div className="space-y-3 text-gray-700 ">
        <h1 className="font-semibold text-lg text-black">Home</h1>
        <p>Pokhara, Chipledhunga, Panthi gali, 3306, Gandaki, Nepal</p>
        {showButton && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleSelectAddress(item)}
          >
            Select
          </Button>
        )}
      </div>
    </Card>
  );
};
