package com.project.maltbackend.controller;

import com.project.maltbackend.model.Review;
import com.project.maltbackend.model.User;
import com.project.maltbackend.request.ReviewRequest;
import com.project.maltbackend.response.ReviewResponse;
import com.project.maltbackend.service.ReviewService;
import com.project.maltbackend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    private final UserService userService;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        ReviewResponse response = reviewService.createReview(request, user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<ReviewResponse>> getRestaurantReviews(
            @PathVariable Long restaurantId) {
        List<ReviewResponse> responses = reviewService.getRestaurantReviews(restaurantId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{restaurantId}/average-rating")
    public ResponseEntity<Double> getRestaurantAverageRating(
            @PathVariable Long restaurantId) {
        double average = reviewService.calculateRestaurantAverageRating(restaurantId);
        return new ResponseEntity<>(average, HttpStatus.OK);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        ReviewResponse response = reviewService.updateReview(reviewId, request, user);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        reviewService.deleteReview(reviewId, user);
        return new ResponseEntity<>("Review deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getReviewByOrderId(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            Review review = reviewService.findReviewByOrderIdAndUserId(orderId, user.getId());

            if (review != null) {
                ReviewResponse response = reviewService.mapToReviewResponse(review);
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
