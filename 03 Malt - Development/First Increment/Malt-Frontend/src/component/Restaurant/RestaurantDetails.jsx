import {
  Card,
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
import { HomeFooter } from "../Home/HomeFooter";
import { OrderBag } from "../Cart/OrderBag";
import SortIcon from "@mui/icons-material/Sort";
import CenterLoader from "../Templates/CenterLoader";
import NoDataFound from "../Templates/NoDataFound";

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
  const [sortOrder, setSortOrder] = useState(""); // "asc" or "desc"

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
    return <CenterLoader message="Loading restaurant details..." />;
  }

  console.log("Restaurant Details ", restaurant);

  return (
    <div>
      <div className="px-5 lg:px-20 mt-22">
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

        {/* Sorting food items on the basis of price */}
        <Card className="p-3.5 mt-3 mb-0.5 shadow-md border border-gray-200 rounded-md bg-white flex items-center gap-2 lg:max-w-full xs:max-w-full">
          <SortIcon className="text-gray-700" />
          <label htmlFor="sort" className="text-gray-700 font-medium">
            Sort by Price:
          </label>
          <select
            id="sort"
            className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-700"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Select Price</option>
            <option value="asc">Lowest to Highest</option>
            <option value="desc">Highest to Lowest</option>
          </select>
        </Card>

        <section className="pt-4 lg:flex relative mb-10">
          <div className="space-y-6 lg:w-[20%] filter p-5 shadow-md mr-3">
            <div className="box space-y-4 lg:sticky top-28">
              <div>
                <Typography variant="h6" sx={{ paddingBottom: "1rem" }}>
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
                <Typography
                  variant="h6"
                  sx={{ paddingTop: "1rem", paddingBottom: "1rem" }}
                >
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

          {/* Menu in center */}
          <div className="space-y-3 lg:w-[60%] mr-3 lg:mt-0 mt-5 ">
            {menu.menuItems.filter((item) => item && item.available).length ===
            0 ? (
              <div className="h-screen flex items-center justify-center">
                <NoDataFound
                  title="No Menu Items Found"
                  description="This restaurant hasn't added any menu items yet."
                  icon="file"
                />
              </div>
            ) : (
              [...menu.menuItems]
                .filter((item) => item && item.available)
                .sort((a, b) => {
                  if (sortOrder === "asc") return a.price - b.price;
                  if (sortOrder === "desc") return b.price - a.price;
                  return a.id - b.id;
                })
                .map((item) => <MenuCard key={item.id} item={item} />)
            )}
          </div>

          <div className="hidden lg:block lg:w-[20%] relative mr-7">
            <OrderBag />
          </div>
        </section>
      </div>
      <HomeFooter />
    </div>
  );
};
