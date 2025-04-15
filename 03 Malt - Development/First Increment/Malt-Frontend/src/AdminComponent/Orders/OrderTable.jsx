import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRestaurantOrders,
  updateOrderStatus,
} from "../../component/State/Restaurant Order/Action";
import { useAlert } from "../../component/Templates/AlertProvider";

const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
];

export const OrderTable = ({ filterValue, selectedYear, selectedMonth }) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { restaurant, restaurantOrder } = useSelector((store) => store);

  const { showAlert } = useAlert();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(
      getRestaurantOrders({
        jwt,
        restaurantId: restaurant?.usersRestaurant?.id,
      })
    );
  }, [jwt, restaurant?.usersRestaurant?.id]);

  const filteredOrders = (restaurantOrder?.restaurantOrders || []).filter(
    (order) => {
      const date = new Date(order.createdAt);
      const matchStatus =
        filterValue === "all" ? true : order.orderStatus === filterValue;
      const matchYear = selectedYear
        ? date.getFullYear() === selectedYear
        : true;
      const matchMonth =
        selectedMonth !== "" ? date.getMonth() === Number(selectedMonth) : true;

      return matchStatus && matchYear && matchMonth;
    }
  );

  const handleClick = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(orderId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleUpdateOrder = (orderId, orderStatus) => {
    dispatch({
      type: "UPDATE_ORDER_STATUS_OPTIMISTIC",
      payload: { orderId, orderStatus },
    });

    dispatch(updateOrderStatus({ orderId, orderStatus, jwt }));
    showAlert("success", "Order status updated");

    handleClose();
  };

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader title="Order History" sx={{ pt: 2 }} />

        {/* Loading State */}
        {/* {restaurantOrder?.loading ? (
          <Box p={2} textAlign="center">
            <CircularProgress />
          </Box>
        ) : */}

        {/* Error state */}
        {restaurantOrder?.error ? (
          <Box p={2}>
            <Typography color="error">
              {restaurantOrder.error.message || "Failed to fetch orders."}
            </Typography>
          </Box>
        ) : /*  Empty State */
        !filteredOrders || filteredOrders.length === 0 ? (
          <Box p={2} textAlign="center">
            <Typography>No orders found.</Typography>
          </Box>
        ) : (
          /* Success State */
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="order table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Id</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Image
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Customer
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Food Item
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Delivery Address
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Order Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders
                  .sort((a, b) => b.id - a.id)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell align="center">
                        <AvatarGroup max={3}>
                          {item.items?.map((orderItem, index) => (
                            <Avatar
                              key={index}
                              src={orderItem.food?.images[0]}
                            />
                          ))}
                        </AvatarGroup>
                      </TableCell>
                      <TableCell align="center">
                        {item?.user?.fullName}
                      </TableCell>
                      <TableCell align="center">
                        {item.items?.map((orderItem, index) => (
                          <Chip
                            key={index}
                            label={`${orderItem.food?.name} x ${orderItem?.quantity}`}
                            variant="outlined"
                            sx={{ margin: "2px" }}
                          />
                        ))}
                      </TableCell>
                      <TableCell align="center">
                        Rs {item?.totalPrice}
                      </TableCell>
                      <TableCell align="center">
                        {item?.deliveryAddress?.city},{" "}
                        {item?.deliveryAddress?.streetAddress}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(event) => handleClick(event, item.id)}
                          sx={{
                            minWidth: "120px",
                            textTransform: "capitalize",
                            fontSize: "0.75rem",
                          }}
                        >
                          {orderStatus.find(
                            (status) => status.value === item.orderStatus
                          )?.label || "Unknown"}
                        </Button>

                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && selectedOrder === item.id}
                          onClose={handleClose}
                        >
                          {orderStatus.map((status) => (
                            <MenuItem
                              key={status.value}
                              onClick={() =>
                                handleUpdateOrder(item.id, status.value)
                              }
                            >
                              {status.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};
