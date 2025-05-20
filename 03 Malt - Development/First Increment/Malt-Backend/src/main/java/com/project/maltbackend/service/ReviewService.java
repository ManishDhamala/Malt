package com.project.maltbackend.service;

import com.project.maltbackend.model.Review;
import com.project.maltbackend.model.User;
import com.project.maltbackend.request.ReviewRequest;
import com.project.maltbackend.response.ReviewResponse;

import java.util.List;

public interface ReviewService {

    public ReviewResponse createReview(ReviewRequest request, User user) throws Exception;

    List<ReviewResponse> getRestaurantReviews(Long restaurantId);
    double calculateRestaurantAverageRating(Long restaurantId);
    ReviewResponse updateReview(Long reviewId, ReviewRequest request, User user) throws Exception;
    void deleteReview(Long reviewId, User user) throws Exception;

    public Review findReviewByOrderIdAndUserId(Long orderId, Long userId) throws Exception;

     ReviewResponse mapToReviewResponse(Review review);
}
