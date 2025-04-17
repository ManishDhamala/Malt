import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export const EventCard = ({ event, isAdmin, handleDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/admin/restaurant/events/edit/${event.id}`);
  };

  return (
    <Card className="w-64 h-auto shadow-md border border-gray-200 overflow-hidden flex flex-col">
      <div className="h-36 w-full overflow-hidden flex-shrink-0">
        <CardMedia
          component="img"
          image={
            event.images?.[0] ||
            "https://images.pexels.com/photos/7159865/pexels-photo-7159865.jpeg?auto=compress&cs=tinysrgb&w=600"
          }
          alt={event.title}
          className="object-cover h-full w-full"
        />
      </div>

      <CardContent className="p-4 flex flex-col gap-2 text-gray-700 flex-grow overflow-hidden">
        <Typography variant="h6" className="font-semibold text-black truncate">
          {event.restaurantName}
        </Typography>

        <Typography
          variant="subtitle2"
          color="text.secondary"
          className="truncate"
        >
          {event.title}
        </Typography>

        <Typography
          variant="body2"
          className="text-sm text-gray-600 line-clamp-3 overflow-hidden"
        >
          {event.description}
        </Typography>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <LocationOnIcon fontSize="small" />
          <span className="truncate">{event.address?.city}</span>
        </div>

        <div className="text-xs mt-1 space-y-2">
          <p className="text-sky-600">
            Start Date:{" "}
            {format(new Date(event.startDate), "MMM dd, yyyy hh:mm a")}
          </p>
          <p className="text-red-600">
            End Date: {format(new Date(event.endDate), "MMM dd, yyyy hh:mm a")}
          </p>
        </div>
      </CardContent>

      {isAdmin && (
        <CardActions className="justify-end">
          <IconButton onClick={handleEdit}>
            <EditIcon color="warning" fontSize="medium" />
          </IconButton>
          <IconButton onClick={() => handleDelete(event.id)}>
            <DeleteIcon color="primary" fontSize="medium" />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};
