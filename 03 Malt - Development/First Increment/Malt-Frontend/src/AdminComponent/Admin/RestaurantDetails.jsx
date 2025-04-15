import { Button, Card, CardContent, CardHeader, Grid } from "@mui/material";
import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useDispatch, useSelector } from "react-redux";
import { updateRestaurantStatus } from "../../component/State/Restaurant/Action";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../component/Templates/AlertProvider";

export const RestaurantDetails = () => {
  const { restaurant } = useSelector((store) => store);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const { showAlert } = useAlert();

  console.log("Restaurant Details: ", restaurant);

  const handleRestaurantStatus = () => {
    dispatch(
      updateRestaurantStatus({
        restaurantId: restaurant.usersRestaurant.id,
        jwt,
      })
    );
    showAlert("success", "Restaurant open status changed");
  };

  return (
    <div className="lg:px-20 px-5 pb-10 ">
      <div className="py-5 flex justify-center items-center gap-1">
        <h1 className="text-2xl lg:text-5xl text-center font-bold p-4">
          {restaurant.usersRestaurant?.name}
        </h1>
        <div>
          <Button
            variant="contained"
            color="warning"
            size="medium"
            sx={{ marginRight: "1rem" }}
            onClick={() => navigate("/admin/restaurant/edit")}
          >
            Edit
          </Button>

          <Button
            color={restaurant.usersRestaurant?.open ? "primary" : "success"}
            className="py-[1rem] px-[2rem]"
            variant="contained"
            onClick={handleRestaurantStatus}
            size="medium"
          >
            {restaurant.usersRestaurant?.open ? "Close" : "Open"}
          </Button>
        </div>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card className="shadow-md border border-gray-200">
            <CardHeader
              title={
                <span className="text-gray-800 font-semibold">
                  Restaurant Details
                </span>
              }
            />
            <CardContent>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">Owner</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.owner?.fullName}
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">Restaurant Name</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.name}
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">Opening Hours</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.openingHours}
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">Status</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.open ? (
                      <span
                        style={{ background: "#388e3c" }}
                        className="px-5 py-2 rounded-full text-white"
                      >
                        Open
                      </span>
                    ) : (
                      <span className="px-5 py-2 rounded-full bg-red-800 text-gray-50">
                        Closed
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card className="shadow-md border border-gray-200">
            <CardHeader
              title={
                <span className="text-gray-800 font-semibold">Address</span>
              }
            />
            <CardContent>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">Country</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.address?.country}
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">Province</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.address?.province}
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">City</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.address?.city}
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">Street Address</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.address?.streetAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card className="shadow-md border border-gray-200">
            <CardHeader
              title={
                <span className="text-gray-800 font-semibold">Contact</span>
              }
            />
            <CardContent>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-25">Email</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.contactInformation?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-25">Mobile</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.contactInformation?.mobile}
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-25 pt-3">Social</p>
                  <div className="flex text-gray-600 items-center pb-3 gap-3">
                    <span className="pr-5">-</span>
                    <a
                      href={
                        restaurant.usersRestaurant?.contactInformation
                          ?.instagram
                      }
                      target="_blank"
                    >
                      <InstagramIcon sx={{ fontSize: "3rem" }} />
                    </a>
                    <a
                      href={
                        restaurant.usersRestaurant?.contactInformation?.twitter
                      }
                      target="_blank"
                    >
                      <XIcon sx={{ fontSize: "3rem" }} />
                    </a>
                    <a href="#">
                      <FacebookIcon sx={{ fontSize: "3rem" }} />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
