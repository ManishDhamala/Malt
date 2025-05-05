import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Slide,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFood,
  getMenuItemsByRestaurantId,
  updateMenuItemsAvailability,
} from "../../component/State/Menu/Action";
import { useAlert } from "../../component/Templates/AlertProvider";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const MenuTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { restaurant, menu } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const { showAlert } = useAlert();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);

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

  const handleOpenDialog = (foodId) => {
    setFoodToDelete(foodId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFoodToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (foodToDelete) {
      dispatch(deleteFood({ foodId: foodToDelete, jwt }));
      showAlert("error", "Food item deleted");
    }
    handleCloseDialog();
  };

  const handleFoodAvailibilty = (id) => {
    dispatch(updateMenuItemsAvailability({ foodId: id, jwt }));
    showAlert("info", "Food availability status updated");
  };

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title="Restaurant Menu"
          sx={{ pt: 2, alignItems: "center" }}
          action={
            <IconButton
              onClick={() => navigate("/admin/restaurant/add-menu")}
              aria-label="settings"
            >
              <AddCircleIcon fontSize="large" />
            </IconButton>
          }
        />
        <CardActions />

        {/*  Loading State */}
        {/* {menu?.loading ? (
          <Box p={3} textAlign="center">
            <CircularProgress />
          </Box>
        ) :  */}

        {/* Error state */}
        {menu?.error ? (
          <Box p={3}>
            <Typography color="error">
              {menu.error.message || "Failed to fetch menu items."}
            </Typography>
          </Box>
        ) : /*  Empty State */
        !menu?.menuItems || menu.menuItems.length === 0 ? (
          <Box p={3} textAlign="center">
            <Typography>No menu items found.</Typography>
          </Box>
        ) : (
          /* Success State */
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="menu table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }} align="left">
                    Image
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Category
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Availability
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menu.menuItems
                  .sort((a, b) => a.id - b.id)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell align="left">
                        <Avatar src={item.images[0]} />
                      </TableCell>
                      <TableCell align="center">{item.name}</TableCell>
                      <TableCell align="center">
                        {item.foodCategory.name}
                      </TableCell>
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
                          onClick={() =>
                            navigate(`/admin/restaurant/edit-menu/${item.id}`, {
                              state: item, // Pass the whole item via navigation state
                            })
                          }
                          color="warning"
                        >
                          <CreateIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => handleOpenDialog(item.id)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="delete-food-dialog-description"
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-food-dialog-description">
            Are you sure you want to delete this menu item? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
