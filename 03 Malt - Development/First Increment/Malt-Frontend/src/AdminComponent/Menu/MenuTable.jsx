import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  IconButton,
} from "@mui/material";
import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CreateIcon from "@mui/icons-material/Create";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFood,
  getMenuItemsByRestaurantId,
  updateMenuItemsAvailability,
} from "../../component/State/Menu/Action";

export const MenuTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { restaurant, menu } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  console.log("Menu --- ", menu);

  useEffect(() => {
    dispatch(
      getMenuItemsByRestaurantId({
        restaurantId: restaurant?.usersRestaurant?.id,
        jwt,
        vegetarian: "",
        foodCategory: "",
      })
    );
  }, [jwt, restaurant?.usersRestaurant?.id]);

  const handleDeleteFood = (foodId) => {
    dispatch(deleteFood({ foodId, jwt }));
  };

  const handleFoodAvailibilty = (id) => {
    dispatch(updateMenuItemsAvailability({ foodId: id, jwt }));
  };

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title={"Restaurant Menu"}
          sx={{ pt: 2, alignItems: "center" }}
          action={
            <IconButton
              onClick={() => navigate("/admin/restaurant/add-menu")}
              aria-label="settings"
            >
              <CreateIcon />
            </IconButton>
          }
        />
        <CardActions />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Image
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Price
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Availability
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menu?.menuItems
                .sort((a, b) => a.id - b.id)
                .map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" align="left" scope="row">
                      <Avatar src={item.images[0]}></Avatar>
                    </TableCell>
                    <TableCell align="center">{item.name}</TableCell>
                    <TableCell align="center">Rs {item.price}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color={item.available ? "success" : "error"}
                        onClick={() => handleFoodAvailibilty(item.id)}
                      >
                        {item.available ? "In Stock" : "Out of Stock"}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleDeleteFood(item.id)}
                        color="primary"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
