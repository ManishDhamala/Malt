import { Box, Card, CardHeader } from "@mui/material";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const orders = [1, 1, 1, 1, 1, 1];

export const OrderTable = () => {
  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title={"Order History"}
          sx={{ pt: 2, alignItems: "center" }}
        />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Id</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Image
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Customer
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Price
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {1}
                  </TableCell>
                  <TableCell align="right">{"image-1"}</TableCell>
                  <TableCell align="right">{"Manish Dhamala"}</TableCell>
                  <TableCell align="right">{"500"}</TableCell>
                  <TableCell align="right">{"Momo"}</TableCell>
                  <TableCell align="right">{"Completed"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
