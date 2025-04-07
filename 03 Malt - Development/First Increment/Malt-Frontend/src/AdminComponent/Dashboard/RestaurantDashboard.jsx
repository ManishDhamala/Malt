import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantOrders } from "../../component/State/Restaurant Order/Action";
import { getRestaurantCategory } from "../../component/State/Restaurant/Action";
import { getMenuItemsByRestaurantId } from "../../component/State/Menu/Action";

// MUI Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PaidIcon from "@mui/icons-material/Paid";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FoodItemOrderChart from "./FoodItemOrderChart";

const currentYear = new Date().getFullYear();

export const RestaurantDashboard = () => {
  const dispatch = useDispatch();
  const { restaurant, menu, restaurantOrder } = useSelector((store) => store);

  const jwt = localStorage.getItem("jwt");
  const restaurantId = restaurant?.usersRestaurant?.id;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    if (restaurantId && jwt) {
      dispatch(getRestaurantOrders({ restaurantId, jwt }));
      dispatch(getRestaurantCategory({ restaurantId }));
      dispatch(
        getMenuItemsByRestaurantId({
          restaurantId,
          vegetarian: "",
          foodCategory: "",
        })
      );
    }
  }, [dispatch, restaurantId, jwt]);

  // Filter orders by selected month and year
  const filteredOrders = useMemo(() => {
    return (
      restaurantOrder?.restaurantOrders?.filter((order) => {
        const date = new Date(order.createdAt);
        const matchesYear = selectedYear
          ? date.getFullYear() === selectedYear
          : true;
        const matchesMonth =
          selectedMonth !== ""
            ? date.getMonth() === Number(selectedMonth)
            : true;
        return matchesYear && matchesMonth;
      }) || []
    );
  }, [restaurantOrder, selectedMonth, selectedYear]);

  const totalIncome = filteredOrders.reduce(
    (acc, order) => acc + (order.totalPrice || 0),
    0
  );

  const DashboardCard = ({ title, count, icon }) => (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.09)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 6px 30px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              backgroundColor: "#e0e7ff",
              p: 1.5,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight={600}
            >
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {count}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <div className="m-4">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={"bold"} fontStyle={"italic"}>
          {restaurant.usersRestaurant?.name} Dashboard
        </Typography>

        {/* Filters */}
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {[...Array(5)].map((_, i) => {
                const year = currentYear - i;
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="month-label">Month</InputLabel>
            <Select
              labelId="month-label"
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Total Income"
            count={totalIncome || 0}
            icon={<CurrencyRupeeIcon fontSize="large" color="success" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Total Orders"
            count={filteredOrders.length || 0}
            icon={<ShoppingCartIcon fontSize="large" color="primary" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Total Menu Items"
            count={menu?.menuItems?.length || 0}
            icon={<RestaurantMenuIcon fontSize="large" color="warning" />}
          />
        </Grid>
      </Grid>

      <FoodItemOrderChart filteredOrders={filteredOrders} />
    </div>
  );
};
