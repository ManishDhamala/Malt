import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getUserPaymentHistory } from "../State/Payment/Action";

const PaymentHistory = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { payment } = useSelector((store) => store);

  useEffect(() => {
    if (jwt) {
      dispatch(getUserPaymentHistory(jwt));
    }
  }, [dispatch, jwt]);

  const renderStatus = (status) => {
    const isSuccess = status === "PAID";
    return (
      <Box
        sx={{
          display: "inline-block",
          px: 2,
          py: 0.5,
          borderRadius: "16px",
          backgroundColor: isSuccess ? "#E6F4EA" : "#FDEAEA",
          color: isSuccess ? "#28a745" : "#dc3545",
          fontWeight: 500,
          fontSize: "0.9rem",
        }}
      >
        ● {isSuccess ? "Success" : "Failed"}
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 9, px: 1 }}>
      <Card className="mt-1">
        <CardHeader
          title="Payment History"
          sx={{ pt: 2, alignItems: "center", fontWeight: "bold" }}
        />

        {payment?.loading ? (
          <Box p={2} textAlign="center">
            <CircularProgress />
          </Box>
        ) : /* Error */
        payment?.error ? (
          <Box p={2}>
            <Typography color="error">
              {payment.error.message || "Failed to fetch payment history"}
            </Typography>
          </Box>
        ) : /* Success but empty */
        payment?.paymentHistory?.length === 0 ? (
          <Box p={2}>
            <Typography>No payment history found.</Typography>
          </Box>
        ) : (
          /*  Success with data */
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="payment history table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Payment Method
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Order ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payment.paymentHistory
                  .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))
                  .map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {moment(payment.paidAt).format("DD/MM/YY HH:mm")}
                      </TableCell>
                      <TableCell align="center">Rs {payment.amount}</TableCell>
                      <TableCell align="center">
                        {payment.paymentMethod}
                      </TableCell>
                      <TableCell align="center">#{payment.orderId}</TableCell>
                      <TableCell align="center">
                        {renderStatus(payment.status)}
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

export default PaymentHistory;
