import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const EventCard = ({ event, isAdmin, handleDelete }) => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const handleEdit = () => {
    navigate(`/admin/restaurant/events/edit/${event.id}`);
  };

  const handleOpenDialog = (eventId) => {
    setEventToDelete(eventId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      handleDelete(eventToDelete);
    }
    handleCloseDialog();
  };

  return (
    <>
      <div className="bg-white h-full rounded-lg shadow-md border border-gray-200 flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Image Section */}
        <div className="h-36 w-full">
          <img
            src={
              event.images?.[0] ||
              "https://images.pexels.com/photos/7159865/pexels-photo-7159865.jpeg?auto=compress&cs=tinysrgb&w=600"
            }
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col p-4 gap-2 flex-grow">
          <h3 className="font-semibold text-lg text-black truncate">
            {event.restaurantName}
          </h3>
          <h4 className="text-sm text-gray-600 truncate">{event.title}</h4>

          <p className="text-sm text-gray-600 line-clamp-3">
            {event.description}
          </p>

          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <LocationOnIcon className="text-gray-400" fontSize="small" />
            <span className="truncate">
              {event.address?.city}, {event.address?.streetAddress}
            </span>
          </div>

          <div className="text-xs mt-1 space-y-1">
            <p className="text-sky-600">
              Start Date:{" "}
              {format(new Date(event.startDate), "MMM dd, yyyy hh:mm a")}
            </p>
            <p className="text-red-600">
              End Date:{" "}
              {format(new Date(event.endDate), "MMM dd, yyyy hh:mm a")}
            </p>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex justify-end px-3 pb-3 gap-2">
            <button
              onClick={handleEdit}
              className="p-2 rounded-full hover:bg-yellow-200 transition"
            >
              <EditIcon color="warning" fontSize="small" />
            </button>
            <button
              onClick={() => handleOpenDialog(event.id)}
              className="p-2 rounded-full hover:bg-blue-200 transition"
            >
              <DeleteIcon color="primary" fontSize="small" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="delete-event-dialog-description"
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-event-dialog-description">
            Are you sure you want to delete this event? This action cannot be
            undone.
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
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
