import {
  Card,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import { OrderTable } from "./OrderTable";

const currentYear = new Date().getFullYear();

const orderStatus = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
];

export const Orders = () => {
  const [filterValue, setFilterValue] = useState("all");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("");

  // Improved filter handler with immediate action
  const handleFilter = (e, value) => {
    // Reset to page 1 when changing filters for better UX
    if (value !== filterValue) {
      // Optional: Reset pagination to first page when filtering
      // dispatch({ type: "SET_CURRENT_PAGE", payload: 0 });
      setFilterValue(value);
    }
  };

  // Improved year/month handlers
  const handleYearChange = (e) => {
    // Optional: Reset pagination to first page
    // dispatch({ type: "SET_CURRENT_PAGE", payload: 0 });
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    // Optional: Reset pagination to first page
    // dispatch({ type: "SET_CURRENT_PAGE", payload: 0 });
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="px-2">
      <Card className="p-5 mb-4">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{ paddingBottom: "1rem" }} variant="h5">
            Order Status
          </Typography>

          {/* Date Filters Top-Right */}
          <Box display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="year-label">Year</InputLabel>
              <Select
                labelId="year-label"
                value={selectedYear}
                label="Year"
                onChange={handleYearChange}
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
                onChange={handleMonthChange}
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

        {/* Status Filter */}
        <FormControl sx={{ marginTop: "1rem" }}>
          <RadioGroup
            onChange={handleFilter}
            row
            name="category"
            value={filterValue}
            sx={{ gap: 5 }}
          >
            {orderStatus.map((item) => (
              <FormControlLabel
                key={item.value}
                value={item.value}
                control={<Radio />}
                label={item.label}
                sx={{ color: "gray" }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Card>

      <OrderTable
        filterValue={filterValue}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};
