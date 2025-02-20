import { Button, Card, CardContent, CardHeader, Grid } from "@mui/material";
import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";

export const RestaurantDetails = () => {
  const handleRestaurantStatus = () => {};

  return (
    <div className="lg:px-20 px-5 pb-10 ">
      <div className="py-5 flex justify-center items-center gap-5">
        <h1 className="text-2xl lg:text-5xl text-center font-bold p-5">
          Rupakot Resort
        </h1>
        <div>
          <Button
            color={true ? "primary" : "error"}
            className="py-[1rem] px-[2rem]"
            variant="contained"
            onClick={handleRestaurantStatus}
            size="medium"
          >
            {true ? "Close" : "Open"}
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
                    Manish Dhamala
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">Restaurant Name</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    Rupakot Resort
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">Opening Hours</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    Sun - Fri 9:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">Status</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    {true ? (
                      <span className="px-5 py-2 rounded-full bg-green-400 text-gray-900">
                        Open
                      </span>
                    ) : (
                      <span className="px-5 py-2 rounded-full bg-red-400 text-gray-50">
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
                    Nepal
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">Province</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    Gandaki
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">City</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    Pokhara
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-45">Street Address</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    Rupakot
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
                    Rupakotresort24@gmail.com
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-25">Mobile</p>
                  <p className="text-gray-600">
                    <span className="pr-5">-</span>
                    +9772361432
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-950 pb-4">
                <div className="flex">
                  <p className="w-25 pt-3">Social</p>
                  <div className="flex text-gray-600 items-center pb-3 gap-3">
                    <span className="pr-5">-</span>
                    <a href="/">
                      <InstagramIcon sx={{ fontSize: "3rem" }} />
                    </a>
                    <a href="/">
                      <XIcon sx={{ fontSize: "3rem" }} />
                    </a>
                    <a href="/">
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
