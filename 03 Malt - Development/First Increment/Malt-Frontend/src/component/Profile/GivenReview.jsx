import React from "react";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const GivenReview = ({ review }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-800 text-center mb-4">
        Your Review
      </h2>

      <div className="mb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Rating</h3>
        <Rating
          name="read-only-rating"
          value={review.rating}
          readOnly
          precision={0.5}
          icon={<StarIcon fontSize="inherit" />}
          emptyIcon={<StarIcon fontSize="inherit" color="disabled" />}
          sx={{ color: "#fbc02d" }}
        />
      </div>

      <div className="mb-2">
        <h3 className="text-lg font-medium text-gray-900">Comment</h3>
        <p className="text-gray-700 bg-gray-50 pt-2">
          {review.comment || "No comment provided"}
        </p>
      </div>

      <div className="flex justify-end">
        <span className="text-gray-500 text-sm">
          Posted on: {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default GivenReview;
