import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../State/Event/Action";
import { EventCard } from "./EventCard";
import { Grid, CircularProgress, Typography } from "@mui/material";
import NoDataFound from "../Templates/NoDataFound";

export const CustomerEvents = () => {
  const dispatch = useDispatch();
  const { event } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  const events = event.allEvents || [];

  if (event.loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="mt-22">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-xl text-center font-semibold">Upcoming Events</h1>
      </div>

      {events.length === 0 ? (
        <NoDataFound
          icon="alert"
          title="No Events Available"
          description="There are currently no upcoming restaurant events. Please check back later!"
        />
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {events
            .sort((a, b) => a.id - b.id)
            .map((event) => (
              <Grid item xs={10} sm={5} md={4} lg={3.3} key={event.id}>
                <EventCard event={event} isAdmin={false} />
              </Grid>
            ))}
        </Grid>
      )}
    </div>
  );
};
