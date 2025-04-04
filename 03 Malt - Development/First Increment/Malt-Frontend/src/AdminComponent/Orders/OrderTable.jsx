import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRestaurantOrders,
  updateOrderStatus,
} from "../../component/State/Restaurant Order/Action";

const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
];

export const OrderTable = ({ filterValue }) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { restaurant, restaurantOrder } = useSelector((store) => store);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(
      getRestaurantOrders({
        jwt,
        restaurantId: restaurant?.usersRestaurant?.id,
      })
    );
    console.log("Fetched Orders:", restaurantOrder?.restaurantOrders);
  }, [jwt, restaurant?.usersRestaurant?.id]);

  //  Correctly filter orders before mapping
  const filteredOrders =
    filterValue === "all"
      ? restaurantOrder?.restaurantOrders
      : restaurantOrder?.restaurantOrders?.filter(
          (order) => order.orderStatus === filterValue
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
    // Optimistically update UI
    dispatch({
      type: "UPDATE_ORDER_STATUS_OPTIMISTIC",
      payload: { orderId, orderStatus },
    });

    // Dispatch API request
    dispatch(updateOrderStatus({ orderId, orderStatus, jwt })).then(() => {
      dispatch(
        getRestaurantOrders({
          jwt,
          restaurantId: restaurant?.usersRestaurant?.id,
        })
      );
    });

    handleClose();
  };

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title="Order History"
          sx={{ pt: 2, alignItems: "center" }}
        />

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
                  Price
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Order Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders?.length > 0 ? (
                filteredOrders
                  .sort((a, b) => b.id - a.id) // Keep order consistent
                  .map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{item.id}</TableCell>

                      {/* Display food images */}
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

                      {/* Customer Name */}
                      <TableCell align="center">
                        {item?.user?.fullName}
                      </TableCell>

                      {/* Price*/}
                      <TableCell align="center">
                        Rs {item?.totalPrice}
                      </TableCell>

                      {/* Food Items */}
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

                      {/* Order Status Button */}
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(event) => handleClick(event, item.id)}
                          sx={{
                            minWidth: "120px",
                            textTransform: "capitalize",
                            fontSize: "0.75rem",
                            backgroundColor: "primary.main",
                            color: "white",
                            "&:hover": { backgroundColor: "primary.dark" },
                          }}
                        >
                          {orderStatus.find(
                            (status) => status.value === item.orderStatus
                          )?.label || "Unknown"}
                        </Button>

                        {/* Dropdown Menu for Updating Order Status */}
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
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
