import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, CircularProgress } from "@mui/material";
import { useAlert } from "../../component/Templates/AlertProvider";
import {
  deleteEvent,
  getRestaurantEvents,
} from "../../component/State/Event/Action";
import { EventCard } from "../../component/Profile/EventCard";
import { CreateEventForm } from "./CreateEventForm";
import NoDataFound from "../../component/Templates/NoDataFound";

export const AdminEvents = () => {
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const jwt = localStorage.getItem("jwt");
  const { event } = useSelector((store) => store);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(getRestaurantEvents(jwt));
  }, [dispatch, jwt]);

  const handleDeleteEvent = (eventId) => {
    dispatch(deleteEvent({ eventId, jwt }))
      .then(() => {
        showAlert("success", "Event deleted successfully");
      })
      .catch((error) => {
        showAlert("error", "Failed to delete event");
        console.error("Error deleting event:", error);
      });
  };

  const handleFormClose = () => {
    setShowForm(false);
    dispatch(getRestaurantEvents(jwt)); // Refresh list after creation
  };

  if (event.loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Manage Restaurant Events</h1>
        {!showForm && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(true)}
          >
            Create New Event
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="mb-10">
          <CreateEventForm
            onSuccess={handleFormClose}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        // Only show events list when not in form mode
        <>
          {event.restaurantEvents?.length === 0 ? (
            <div className="mt-30">
              <NoDataFound
                icon="alert"
                title="No Events Available"
                description="You haven't created any events yet Create your first event"
              />
            </div>
          ) : (
            <Grid container spacing={3}>
              {event.restaurantEvents
                .sort((a, b) => a.id - b.id)
                .map((event) => (
                  <Grid item xs={10} sm={5} md={4} lg={3.5} key={event.id}>
                    <EventCard
                      event={event}
                      isAdmin={true}
                      handleDelete={handleDeleteEvent}
                    />
                  </Grid>
                ))}
            </Grid>
          )}
        </>
      )}
    </div>
  );
};
