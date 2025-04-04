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
    <Card sx={{ mt: 5 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Orders Graph
        </Typography>

        <BarChart
          xAxis={[
            {
              id: "food",
              data: chartData.xLabels,
              scaleType: "band",
              tickPlacement: "middle",
              tickLabelPlacement: "middle",
            },
          ]}
          yAxis={[{ label: "Quantity Ordered" }]}
          series={[
            { data: chartData.yValues, label: "Quantity", color: "#B20303" },
          ]}
          width={700}
          height={400}
        />
      </CardContent>
    </Card>
  );
};

export default FoodItemOrderChart;
