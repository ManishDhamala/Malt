import React, { useMemo } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const MonthlyOrderTrendChart = ({ orders, selectedYear }) => {
  const chartData = useMemo(() => {
    const monthlyCounts = Array(12).fill(0); // Jan to Dec

    orders?.forEach((order) => {
      const date = new Date(order.createdAt);
      if (date.getFullYear() === selectedYear) {
        const month = date.getMonth(); // 0 = Jan
        monthlyCounts[month]++;
      }
    });

    return monthlyCounts;
  }, [orders, selectedYear]);

  return (
    <Card sx={{ mt: 3, boxShadow: 3, mb: 5 }}>
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          📈 Monthly Order Trend - {selectedYear}
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 2, color: "#555" }}>
          Number of orders received each month
        </Typography>

        <LineChart
          xAxis={[
            {
              data: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              scaleType: "point",
              label: "Month",
              labelStyle: { fontWeight: "bold", fill: "#333" },
            },
          ]}
          series={[
            {
              data: chartData,
              label: "Orders",
              area: true,
              showMark: true,
              color: "#1976d2",
            },
          ]}
          width={700}
          height={300}
        />
      </CardContent>
    </Card>
  );
};

export default MonthlyOrderTrendChart;
