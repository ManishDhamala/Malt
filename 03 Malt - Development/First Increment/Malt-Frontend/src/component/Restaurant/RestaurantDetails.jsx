import {
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Grid2,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import React, { useState } from "react";
import { MenuCard } from "./MenuCard";

const categories = [
  "All",
  "pizza",
  "Momo",
  "Burgar",
  "Chowmein",
  "Wings",
  "Biryani",
];

const foodTypes = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Veg",
    value: "vegetarian",
  },
  {
    label: "Non-Veg",
    value: "non-veg",
  },
];

const menu = [1, 1, 1, 1, 1, 1];

export const RestaurantDetails = () => {
  const [foodType, setFoodType] = useState("all");

  const handleFilter = (e) => {
    console.log(e.target.value, e.target.name);
  };
  return (
    <div className="px-5 lg:px-20 lg:mt-22">
      <section>
        <h3 className="text-gray-700 py-2 mt-5">Home/Nepal/Cheli Thakali/5</h3>
        <div>
          <Grid container spacing={2}>
            {/* Full-width image */}
            <Grid item xs={12}>
              <img
                className="w-full h-[40vh] object-cover"
                src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="restaurant-image"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <img
                className="w-full h-[40vh] object-cover"
                src="https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="restaurant-image"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <img
                className="w-full h-[40vh] object-cover"
                src="https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="restaurant-image"
              />
            </Grid>
          </Grid>
        </div>

        <div className="pt-3 pb-5">
          <h1 className="text-4xl font-semibold">Cheli Thakali</h1>
          <p className="text-gary-700 mt-1">
            Description Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quaerat delectus exercitationem ullam, quibusdam repellat modi
            dignissimos quidem atque distinctio similique impedit explicabo!
            Unde praesentium aut perferendis aperiam deserunt ratione?
            Dignissimos?
          </p>
          <div className="space-y-3 mt-3">
            <p className="text-gray-700 flex items-center gap-3">
              <LocationOnIcon />
              <span>Pokhara, Chipledhunga</span>
            </p>
            <p className="text-gray-700 flex items-center gap-3">
              <CalendarTodayIcon />
              <span>Sun - Fri: 10:00 AM - 8:00 PM (Today)</span>
            </p>
          </div>
        </div>
      </section>
      <Divider />
      <section className="pt-[1.8rem] lg:flex relative">
        <div className="space-y-10 lg:w-[20%] filter p-5 shadow-md">
          <div className="box space-y-5 lg:sticky top-28">
            <div>
              <Typography variant="h5" sx={{ paddingBottom: "1rem" }}>
                Food Type
              </Typography>
              <FormControl className="py-10 space-y-5" component={"fieldset"}>
                <RadioGroup
                  onChange={handleFilter}
                  name="food_type"
                  value={foodType}
                >
                  {foodTypes.map((item) => (
                    <FormControlLabel
                      key={item.value}
                      value={item.value}
                      control={<Radio />}
                      label={item.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
            <Divider />
            <div>
              <Typography variant="h5" sx={{ paddingTop: "1rem" }}>
                Food Category
              </Typography>
              <FormControl className="py-10 space-y-5" component={"fieldset"}>
                <RadioGroup
                  onChange={handleFilter}
                  name="food_type"
                  value={foodType}
                >
                  {categories.map((item) => (
                    <FormControlLabel
                      key={item}
                      value={item}
                      control={<Radio />}
                      label={item}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:w-[80%] mr-20">
          {menu.map((item) => (
            <MenuCard />
          ))}
        </div>
      </section>
    </div>
  );
};
