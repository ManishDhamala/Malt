import React from "react";
import { Button, Card } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export const AddressCard = ({ item, showButton, handleSelectAddress }) => {
  return (
    <Card className="flex gap-5 w-64 p-5 shadow-md border border-gray-200 ">
      <LocationOnIcon />
      <div className="space-y-3 text-gray-700 ">
        <h1 className="font-semibold text-lg text-black">
          {item?.streetAddress}
        </h1>
        <p>
          {" "}
          {item?.streetAddress}, {item?.landmark && `${item?.landmark}, `}
          {item?.postalCode && `${item?.postalCode}, `}
          {item?.city}, {item?.province}, {item?.country}
        </p>
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
