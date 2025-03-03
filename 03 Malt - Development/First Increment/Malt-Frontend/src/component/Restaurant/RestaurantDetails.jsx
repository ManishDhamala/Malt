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
import React, { useEffect, useState } from "react";
import { MenuCard } from "./MenuCard";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getRestaurantById,
  getRestaurantCategory,
} from "../State/Restaurant/Action";
import { getMenuItemsByRestaurantId } from "../State/Menu/Action";

const foodTypes = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Veg",
    value: "true",
  },
  {
    label: "Non-Veg",
    value: "false",
  },
];

export const RestaurantDetails = () => {
  const [foodType, setFoodType] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { auth, restaurant, menu } = useSelector((store) => store);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { id, city } = useParams();

  const handleFilter = (e) => {
    setFoodType(e.target.value);
    console.log(e.target.value, e.target.name);
  };

  const handleFilterCategory = (e, value) => {
    setSelectedCategory(value);
    console.log(e.target.value, e.target.name, value);
  };

  // useEffect(() => {
  //   dispatch(getRestaurantById({ jwt, restaurantId: id }));
  // }, [dispatch, jwt, id]);

  useEffect(() => {
    setLoading(true); // Start loading before fetching
    dispatch(getRestaurantById({ restaurantId: id }));
    dispatch(getRestaurantCategory({ restaurantId: id })).finally(() => {
      setLoading(false); // Stop loading after fetch
    });
  }, [dispatch, id, city]);

  useEffect(() => {
    dispatch(
      getMenuItemsByRestaurantId({
        restaurantId: id,
        vegetarian: foodType,
        foodCategory: selectedCategory,
      })
    );
  }, [selectedCategory, foodType]);

  // Show loading until restaurant data is available
  if (loading || !restaurant?.restaurants) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 text-lg">Loading restaurant details...</p>
      </div>
    );
  }

  console.log("Restaurant Details ", restaurant);

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 text-lg">Loading restaurant details...</p>
      </div>
    );
  }

  return (
    <div className="px-5 lg:px-20 lg:mt-22">
      <section>
        <h3 className="text-gray-700 py-2 mt-5">
          Nepal/{restaurant.restaurants?.address?.city}/
          {restaurant.restaurants?.name}
        </h3>
        <div>
          <Grid container spacing={2}>
            {/* Full-width image */}
            <Grid item xs={12}>
              {restaurant?.restaurants?.images?.length > 0 ? (
                <img
                  className="w-full h-[40vh] object-cover"
                  src={restaurant.restaurants.images[0]}
                  alt="restaurant-image"
                />
              ) : (
                <div className="w-full h-[40vh] bg-gray-200 flex items-center justify-center">
                  No Image Available
                </div>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              {restaurant?.restaurants?.images?.[1] ? (
                <img
                  className="w-full h-[40vh] object-cover"
                  src={restaurant.restaurants.images[1]}
                  alt="restaurant-image"
                />
              ) : (
                <div className="w-full h-[40vh] bg-gray-200 flex items-center justify-center">
                  No Image Available
                </div>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              {restaurant?.restaurants?.images?.[2] ? (
                <img
                  className="w-full h-[40vh] object-cover"
                  src={restaurant.restaurants.images[2]}
                  alt="restaurant-image"
                />
              ) : (
                <div className="w-full h-[40vh] bg-gray-200 flex items-center justify-center">
                  No Image Available
                </div>
              )}
            </Grid>
          </Grid>
        </div>

        <div className="pt-3 pb-5">
          <h1 className="text-4xl font-semibold">
            {restaurant.restaurants?.name || "Loading..."}
          </h1>
          <p className="text-gary-700 mt-1">
            {restaurant.restaurants?.description || "Loading..."}
          </p>
          <div className="space-y-3 mt-3">
            <p className="text-gray-700 flex items-center gap-3">
              <LocationOnIcon />
              <span>
                {" "}
                {restaurant.restaurants?.address?.city || "N/A"},{" "}
                {restaurant.restaurants?.address?.streetAddress || "N/A"}
              </span>
            </p>
            <p className="text-gray-700 flex items-center gap-3">
              <CalendarTodayIcon />
              <span>{restaurant.restaurants?.openingHours || "N/A"}</span>
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
                  onChange={handleFilterCategory}
                  name="food_category"
                  value={selectedCategory}
                >
                  {/* Default "All" filter */}
                  <FormControlLabel
                    key="all"
                    value=""
                    control={<Radio />}
                    label="All"
                  />
                  {restaurant.categories.map((item) => (
                    <FormControlLabel
                      key={item.id}
                      value={item.name}
                      control={<Radio />}
                      label={item.name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:w-[80%] mr-20">
          {menu.menuItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};
