import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

export const EventCard = () => {
  return (
    <div>
      <Card sx={{ width: 310 }}>
        <CardMedia
          sx={{ height: 200 }}
          image="https://images.pexels.com/photos/7159865/pexels-photo-7159865.jpeg?auto=compress&cs=tinysrgb&w=600"
        />
        <CardContent>
          <Typography variant="h5">Dream High Restaurant</Typography>
          <Typography variant="body2">50% off on Birthday</Typography>
          <div className="py-2 space-y-2">
            <p>{"Pokhara"}</p>
            <p className="text-sm text-sky-500">Feburary 10, 2025 10:00 AM</p>
            <p className="text-sm text-red-500">Feburary 20, 2025 08:00 PM</p>
            <p></p>
          </div>
        </CardContent>

        {false && (
          <CardActions>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        )}
      </Card>
    </div>
  );
};
