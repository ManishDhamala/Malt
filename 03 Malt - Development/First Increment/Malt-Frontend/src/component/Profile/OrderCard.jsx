import React, { useState, useEffect } from "react";
import { Button, Card, Modal, Box } from "@mui/material";
import ReviewModal from "./ReviewModal";
import { useDispatch, useSelector } from "react-redux";
import { getReviewByOrderId } from "../State/Review/Action";
import GivenReview from "./GivenReview";

const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
];

const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const OrderCard = ({ item, order }) => {
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [openGivenReviewModal, setOpenGivenReviewModal] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { review } = useSelector((store) => store);

  // Fetch review when component mounts or order.id changes
  useEffect(() => {
    if (order.orderStatus === "DELIVERED") {
      dispatch(getReviewByOrderId({ orderId: order.id, jwt }))
        .then((result) => {
          if (result && result?.id) {
            setExistingReview(result);
          } else {
            setExistingReview(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching review:", error);
          setExistingReview(null);
        });
    }
  }, [dispatch, order.id, order.orderStatus, jwt]);

  const handleOpenReview = () => {
    if (existingReview) {
      setOpenGivenReviewModal(true);
    } else {
      setOpenReviewModal(true);
    }
  };

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
  };

  const handleCloseGivenReviewModal = () => {
    setOpenGivenReviewModal(false);
  };

  return (
    <>
      <Card className="flex flex-col md:flex-row justify-between items-center p-5 shadow-lg border border-gray-200 rounded-lg bg-white">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <img
            className="h-20 w-20 object-cover rounded-lg"
            src={item.food?.images[0]}
            alt="food-image"
          />
          <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
            <h6 className="font-semibold text-lg truncate max-w-xs">
              Restaurant:{" "}
              {order?.restaurant?.title || order?.restaurant?.name || "Unknown"}
            </h6>
            <p className="text-gray-500">
              Order No: <span className="font-medium">#{order.id}</span>
            </p>
            <p className="text-gray-500">
              Date:{" "}
              <span className="font-medium">
                {formatDate(order?.createdAt)}
              </span>
            </p>
            <p className="font-medium">
              {item.food?.name}{" "}
              <span className="text-gray-500">x {item?.quantity}</span> =
              <span className="font-semibold"> Rs {item?.totalPrice}</span>
            </p>
            <p className="text-gray-500 mr-8">
              {order?.deliveryAddress?.streetAddress},{" "}
              {order?.deliveryAddress?.city}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4 md:mt-0">
          <Button
            variant="contained"
            size="small"
            sx={{
              minWidth: "120px",
              textTransform: "capitalize",
              fontSize: "0.75rem",
              backgroundColor: "primary.main",
              color: "white",
              cursor: "not-allowed",
            }}
          >
            {orderStatus.find((status) => status.value === order.orderStatus)
              ?.label || "Unknown"}
          </Button>

          {/* Review Button - Only for delivered orders */}
          {order.orderStatus === "DELIVERED" && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleOpenReview}
              sx={{
                minWidth: "120px",
                textTransform: "capitalize",
                fontSize: "0.75rem",
                color: "#153b99",
                borderColor: "#153b99",
                "&:hover": {
                  backgroundColor: "rgba(21, 59, 153, 0.08)",
                  borderColor: "#153b99",
                },
              }}
            >
              Review
            </Button>
          )}
        </div>
      </Card>

      {/* Review Modal for submitting new review */}
      <ReviewModal
        open={openReviewModal}
        onClose={handleCloseReviewModal}
        orderId={order.id}
        existingReview={existingReview}
      />

      {/* Modal for displaying existing review */}
      <Modal
        open={openGivenReviewModal}
        onClose={handleCloseGivenReviewModal}
        aria-labelledby="given-review-modal-title"
        aria-describedby="given-review-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <GivenReview review={existingReview} />
        </Box>
      </Modal>
    </>
  );
};
