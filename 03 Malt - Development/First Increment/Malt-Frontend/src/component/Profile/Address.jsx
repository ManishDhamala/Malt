import React, { useEffect } from "react";
import { AddressCard } from "../Cart/AddressCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSavedAddresses } from "../State/Address/Action";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import CenterLoader from "../Templates/CenterLoader";
import NoDataFound from "../Templates/NoDataFound";

export const Address = () => {
  const { address } = useSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(getSavedAddresses(jwt));
  }, []);

  const createOrderUsingSelectedAddress = () => {
    navigate("/cart");
    console.log("Address");
  };

  if (address.loading) {
    return <CenterLoader message="Loading saved address..." />;
  }

  if (address.savedAddresses.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <NoDataFound
          title="No Saved Address"
          description="You haven't saved any address yet."
          icon="file"
          actionLabel="Save delivery address"
          onAction={() => navigate("/cart")}
        />
      </div>
    );
  }

  return (
    <div className="lg:mt-22">
      <h1 className="py-5 text-xl font-semibold text-center">
        <BookmarkAddedIcon sx={{ fontSize: 23 }} />
        <span className="ml-2">Saved Address </span>
      </h1>
      <div className="flex flex-wrap gap-3 justify-center">
        {address.savedAddresses
          .sort((a, b) => b.id - a.id)
          .map((item, index) => (
            <AddressCard
              key={index}
              handleSelectAddress={createOrderUsingSelectedAddress}
              item={item}
              showButton={true}
            />
          ))}
      </div>
    </div>
  );
};
