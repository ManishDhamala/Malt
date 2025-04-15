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

  const handleFilter = (e, value) => setFilterValue(value);

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

        {/* Status Filter */}
        <FormControl sx={{ marginTop: "1rem" }}>
          <RadioGroup
            onChange={handleFilter}
            row
            name="category"
            value={filterValue || "all"}
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
