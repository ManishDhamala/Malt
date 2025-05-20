import { Grid, Card, Typography, Box, Rating } from "@mui/material";
import RateReviewIcon from "@mui/icons-material/RateReview";

const CustomerReviews = ({ reviews }) => {
  return (
    <section className="py-3">
      <Typography variant="h5" sx={{ fontWeight: 500 }} gutterBottom>
        <RateReviewIcon
          className="mr-1 text-blue-500"
          sx={{ fontSize: "1.8rem" }}
        />
        Customer Reviews
      </Typography>
      {reviews?.length > 0 ? (
        <Grid container spacing={2}>
          {reviews
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
    </section>
  );
};

export default CustomerReviews;
