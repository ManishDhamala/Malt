import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Card, Typography, Box, Rating } from "@mui/material";
import {
  getAverageRating,
  getRestaurantReviews,
} from "../../component/State/Review/Action";
import CenterLoader from "../../component/Templates/CenterLoader";
import StarIcon from "@mui/icons-material/Star";
import RateReviewIcon from "@mui/icons-material/RateReview";

const RestaurantReviews = () => {
  const dispatch = useDispatch();
  const { restaurant, review } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const restaurantId = restaurant?.usersRestaurant?.id;

  useEffect(() => {
    if (restaurantId && jwt) {
      dispatch(getRestaurantReviews(restaurantId));
      dispatch(getAverageRating(restaurantId));
    }
  }, [dispatch, restaurantId, jwt]);

  if (review.loading) {
    return <CenterLoader message="Loading reviews..." />;
  }

  return (
    <div className="p-5">
      <Typography variant="h5" sx={{ fontWeight: "500" }} gutterBottom>
        <RateReviewIcon
          className="mr-1 text-blue-500"
          sx={{ fontSize: "1.9rem" }}
        />
        Customer Reviews
      </Typography>
      <div className="flex items-center gap-1 rounded mb-4">
        <StarIcon className="text-yellow-500" />
        <span className="font-semibold">{review?.averageRating}</span>
        <span className="text-gray-700 text-sm">
          ({review?.reviews?.length || 0} reviews)
        </span>
      </div>
      {review?.reviews?.length > 0 ? (
        <Grid container spacing={2}>
          {review?.reviews
            ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((rev) => (
              <Grid item xs={12} sm={6} md={4} key={rev.id}>
                <Card
                  sx={{ p: 2, boxShadow: 3 }}
                  className="border shadow-md border-gray-300"
                >
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold mr-2">
                      {rev.userFullName?.charAt(0) || "U"}
                    </span>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {rev?.userFullName || "Anonymous"}
                    </Typography>
                  </Box>
                  <Rating value={rev.rating} readOnly size="small" />
                  <Typography variant="body2" className="text-gray-700">
                    {rev?.comment || "No comment provided."}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-gray-600"
                    mt={1}
                  >
                    Posted on:{" "}
                    {new Date(rev.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Card>
              </Grid>
            ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No reviews available for this restaurant.
        </Typography>
      )}
    </div>
  );
};

export default RestaurantReviews;
