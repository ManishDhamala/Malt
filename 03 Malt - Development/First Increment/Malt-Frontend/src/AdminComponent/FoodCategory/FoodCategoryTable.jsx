import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CircularProgress,
  IconButton,
  Modal,
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
import CreateIcon from "@mui/icons-material/Create";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import { CreateFoodCategoryForm } from "./CreateFoodCategoryForm";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFoodCategory,
  getRestaurantCategory,
} from "../../component/State/Restaurant/Action";
import { useAlert } from "../../component/Templates/AlertProvider";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
};

export const FoodCategoryTable = () => {
  const { restaurant } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { showAlert } = useAlert();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleteFoodCategory = (categoryId) => {
    dispatch(deleteFoodCategory({ categoryId, jwt }));
    showAlert("error", "Food category deleted");
  };

  useEffect(() => {
    dispatch(
      getRestaurantCategory({
        jwt,
        restaurantId: restaurant?.usersRestaurant?.id,
      })
    );
  }, [jwt, restaurant?.usersRestaurant?.id]);

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title={"Food Category"}
          sx={{ pt: 2, alignItems: "center" }}
          action={
            <IconButton onClick={handleOpen} aria-label="settings">
              <AddCircleIcon fontSize="large" />
            </IconButton>
          }
        />
        <CardActions />

        {/*  Loading State */}
        {/* {restaurant?.loading ? (
          <Box p={3} textAlign="center">
            <CircularProgress />
          </Box>
        ) : */}
        {/* Error State  */}
        {restaurant?.error ? (
          <Box p={3}>
            <Typography color="error">
              {restaurant.error.message || "Failed to fetch categories."}
            </Typography>
          </Box>
        ) : /*  Empty State */
        !restaurant?.categories || restaurant.categories.length === 0 ? (
          <Box p={3} textAlign="center">
            <Typography>No food categories found.</Typography>
          </Box>
        ) : (
          /*  Success State */
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="category table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }} align="left">
                    Id
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="left">
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="left">
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {restaurant.categories
                  .sort((a, b) => a.id - b.id)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleDeleteFoodCategory(item.id)}
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
        )}
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CreateFoodCategoryForm />
        </Box>
      </Modal>
    </Box>
  );
};
