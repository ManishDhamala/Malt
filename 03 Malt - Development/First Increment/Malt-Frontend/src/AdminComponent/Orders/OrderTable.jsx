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
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRestaurantOrders,
  updateOrderStatus,
} from "../../component/State/Restaurant Order/Action";
import { format } from "date-fns";
import { TablePagination } from "../../component/Pagination/TablePagination";
import { debounce } from "lodash";
import {
  connectToOrderUpdates,
  disconnect,
} from "../../component/config/websocket";
import { useAlert } from "../../component/Templates/AlertProvider";
import {
  ADD_NEW_ORDER_OPTIMISTIC,
  UPDATE_ORDER_STATUS_OPTIMISTIC,
} from "../../component/State/Restaurant Order/ActionType";
import { Client } from "@stomp/stompjs";

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
  const [pageSize, setPageSize] = useState(10);
  const isStatusUpdating = useRef(false);
  const prevFilterValueRef = useRef(filterValue);

  // Track previous filter values to determine what triggered the change
  const prevSelectedYearRef = useRef(selectedYear);
  const prevSelectedMonthRef = useRef(selectedMonth);

  // Get pagination data from Redux store
  const {
    restaurantOrders,
    loading,
    error,
    currentPage,
    totalPages,
    totalOrders,
  } = restaurantOrder;

  // Use separate handlers for different types of changes
  const fetchOrders = (params) => {
    dispatch(getRestaurantOrders(params));
  };

  // Only debounce search and text input changes, not radio selections
  const debouncedFetchOrders = useMemo(
    () => debounce(fetchOrders, 300),
    [dispatch]
  );

  // WebSocket connection management
  useEffect(() => {
    if (!restaurant?.usersRestaurant?.id) return;

    const restaurantId = restaurant.usersRestaurant.id;

    const handleNewOrder = (newOrder) => {
      dispatch({
        type: ADD_NEW_ORDER_OPTIMISTIC,
        payload: newOrder,
      });

      // Always show alert for new orders
      showAlert("success", `New order #${newOrder.id} received!`, {
        position: "top-right",
        autoClose: 5000,
      });
    };

    const handleStatusUpdate = ({ orderId, newStatus }) => {
      dispatch({
        type: UPDATE_ORDER_STATUS_OPTIMISTIC,
        payload: { orderId, orderStatus: newStatus },
      });

      // Optional: Show alert for status updates too
      showAlert("info", `Order #${orderId} updated to ${newStatus}`);
    };

    // Connect to WebSocket with proper error handling
    const socket = connectToOrderUpdates(
      restaurantId,
      handleNewOrder,
      handleStatusUpdate
    );

    // Cleanup on unmount
    return () => Client.activate && Client.deactivate();
  }, [restaurant?.usersRestaurant?.id]);

  useEffect(() => {
    // Don't fetch when component mounts if we don't have restaurant info yet
    if (!restaurant?.usersRestaurant?.id) return;

    // Skip fetching if this is triggered by a status update
    if (isStatusUpdating.current) {
      isStatusUpdating.current = false;
      return;
    }

    // Create base params
    const params = {
      jwt,
      restaurantId: restaurant?.usersRestaurant?.id,
      orderStatus: filterValue === "all" ? null : filterValue,
      page: currentPage,
      size: pageSize,
      year: selectedYear,
      month: selectedMonth !== "" ? selectedMonth : null,
    };

    // If filter value changed, use immediate fetch instead of debounce
    const isFilterValueChange = filterValue !== prevFilterValueRef.current;
    prevFilterValueRef.current = filterValue;

    // Track what changed to optimize fetch strategy
    const isYearChange = selectedYear !== prevSelectedYearRef.current;
    const isMonthChange = selectedMonth !== prevSelectedMonthRef.current;
    prevSelectedYearRef.current = selectedYear;
    prevSelectedMonthRef.current = selectedMonth;

    // Different handling based on what changed
    if (isFilterValueChange) {
      // Radio button changes should be immediate - bypass debounce
      fetchOrders(params);
    } else if (isYearChange || isMonthChange) {
      // Dropdown selects should also be immediate
      fetchOrders(params);
    } else {
      // Other changes like pagination can be debounced
      debouncedFetchOrders(params);
    }
  }, [
    jwt,
    restaurant?.usersRestaurant?.id,
    currentPage,
    pageSize,
    filterValue,
    selectedYear,
    selectedMonth,
  ]);

  const handlePageChange = (newPage) => {
    dispatch({
      type: "SET_CURRENT_PAGE",
      payload: newPage,
    });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    // Reset to first page when page size changes
    dispatch({
      type: "SET_CURRENT_PAGE",
      payload: 0,
    });
  };

  const handleClick = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(orderId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleUpdateOrder = (orderId, orderStatus) => {
    // Set the ref to prevent triggering a fetch
    isStatusUpdating.current = true;

    // Update the state optimistically
    dispatch({
      type: "UPDATE_ORDER_STATUS_OPTIMISTIC",
      payload: { orderId, orderStatus },
    });

    // Make the API call
    dispatch(updateOrderStatus({ orderId, orderStatus, jwt }));
    showAlert("success", "Order status updated");

    handleClose();
  };

  // Calculate loading state with better UX
  const isTableLoading = loading && restaurantOrders.length === 0;
  const isRefreshing = loading && restaurantOrders.length > 0;

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <Typography variant="h6">Order History</Typography>
              {isRefreshing && <CircularProgress size={20} sx={{ ml: 2 }} />}
            </Box>
          }
          sx={{ pt: 2 }}
        />

        {isTableLoading ? (
          <Box p={2} textAlign="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box p={2}>
            <Typography color="error">
              {error.message || "Failed to fetch orders."}
            </Typography>
          </Box>
        ) : restaurantOrders.length === 0 ? (
          <Box p={2} textAlign="center">
            <Typography>No orders found.</Typography>
          </Box>
        ) : (
          /* Success State */
          <>
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
                      Date
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
                  {restaurantOrders.map((item) => (
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
                        {format(new Date(item.createdAt), "d MMMM, h:mm a")}
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
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalOrders}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </Card>
    </Box>
  );
};
