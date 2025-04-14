import React, { useMemo } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useSelector } from "react-redux";

const FoodItemOrderChart = ({ filteredOrders }) => {
  const chartData = useMemo(() => {
    const itemQuantityMap = {};

    filteredOrders?.forEach((order) => {
      order?.items?.forEach((item) => {
        const name = item?.food?.name;
        const quantity = item?.quantity || 0;
        if (name) {
          itemQuantityMap[name] = (itemQuantityMap[name] || 0) + quantity;
        }
      });
    });

    const sortedItems = Object.entries(itemQuantityMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const xLabels = sortedItems.map(([name]) => name);
    const yValues = sortedItems.map(([, quantity]) => quantity);

    return { xLabels, yValues };
  }, [filteredOrders]);

  return (
    <Card sx={{ mt: 5, boxShadow: 3 }}>
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          📊 Most Ordered Foods
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 2, color: "#555" }}>
          Top 5 menu items with the highest quantity ordered
        </Typography>

        <BarChart
          xAxis={[
            {
              id: "food",
              data: chartData.xLabels,
              scaleType: "band",
              tickPlacement: "middle",
              tickLabelPlacement: "middle",
              label: "🍽️ Menu Items",
              labelStyle: { fontWeight: "bold", fill: "#333" },
            },
          ]}
          yAxis={[
            {
              label: "🛒 Quantity Ordered", // Adjust automatically with the  maximum value
              labelStyle: { fontWeight: "bold", fill: "#333" },
            },
          ]}
          series={[
            {
              data: chartData.yValues,
              label: "Quantity",
              color: "#B20303",
            },
          ]}
          width={700}
          height={400}
        />
      </CardContent>
    </Card>
  );
};

export default FoodItemOrderChart;
