import { useState } from "react";
import { useDispatch } from "react-redux";
import { Rating } from "@mui/material";
import { createReview } from "../State/Review/Action";
import { useAlert } from "../Templates/AlertProvider";

const ReviewModal = ({ open, onClose, orderId, existingReview }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(-1);

  const { showAlert } = useAlert();

  const handleSubmit = async () => {
    const reviewData = {
      orderId: orderId,
      rating: rating,
      comment: comment.trim() || "",
    };

    const jwt = localStorage.getItem("jwt");

    try {
      await dispatch(createReview({ reviewData, jwt }));
      showAlert("success", "Review Submitted");
      handleReset();
      onClose();
    } catch (error) {
      console.log("This is an error:", error);
      const errorMsg = error.response?.data?.message || "Something went wrong";
      showAlert("error", errorMsg);
    }
  };

  const handleReset = () => {
    setRating(0);
    setComment("");
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:ml-55 sm:mt-20">
      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-lg border border-gray-400">
        <h2 className="text-xl font-bold text-center text-red-800 mb-4">
          {existingReview ? "Your Review" : "Rate your experience"}
        </h2>

        {existingReview ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 font-semibold mb-1">Rating</p>
              <Rating
                name="read-only-rating"
                value={existingReview.rating}
                readOnly
                sx={{ fontSize: "2.2rem" }}
              />
              <span className="ml-2 text-gray-700 text-lg">
                {existingReview.rating}
              </span>
            </div>

            {existingReview.comment && (
              <div>
                <p className="text-gray-700 font-semibold mb-1">Comment</p>
                <p className="text-gray-700 p-2 border rounded-md bg-gray-50">
                  {existingReview.comment}
                </p>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="border border-gray-500 text-gray-700 px-3 py-1 text-sm rounded hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-700 font-semibold mb-1">Rating</p>
              <div className="flex items-center">
                <Rating
                  name="restaurant-rating"
                  value={rating}
                  precision={1}
                  sx={{ fontSize: "2.2rem" }}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                />
                <span className="ml-2 text-gray-700 text-lg">
                  {hover !== -1 ? hover : rating}
                </span>
              </div>
            </div>

            <textarea
              placeholder="Comment (Optional)"
              rows={3}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={handleCancel}
                className="border border-gray-500 text-gray-700 px-3 py-1 text-sm rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className={`px-3 py-1 text-sm rounded text-white ${
                  rating === 0
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Submit Review
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
