package com.project.maltbackend.service;

import com.project.maltbackend.exception.BadRequestException;
import com.project.maltbackend.exception.ResourceNotFoundException;
import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.Review;
import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.OrderRepository;
import com.project.maltbackend.repository.ReviewRepository;
import com.project.maltbackend.request.ReviewRequest;
import com.project.maltbackend.response.ReviewResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImp implements ReviewService {

    private final ReviewRepository reviewRepository;

    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewRequest request, User user) throws Exception {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        validateReviewEligibility(user, order);

        Review review = new Review();
        review.setUser(user);
        review.setRestaurant(order.getRestaurant());
        review.setOrder(order);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);
        return mapToReviewResponse(savedReview);
    }

    @Override
    public List<ReviewResponse> getRestaurantReviews(Long restaurantId) {
        List<Review> reviews = reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
        return reviews.stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }


    @Override
    public double calculateRestaurantAverageRating(Long restaurantId) {
        Double average = reviewRepository.calculateAverageRatingByRestaurantId(restaurantId);
        if (average == null) {
            return 0.0;
        }
        return Math.round(average * 10.0) / 10.0; // Round to 1 decimal place
    }


    @Override
    @Transactional
    public ReviewResponse updateReview(Long reviewId, ReviewRequest request, User user) throws Exception {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new Exception("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new Exception("You are not authorized to edit this review");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        Review updatedReview = reviewRepository.save(review);

        return mapToReviewResponse(updatedReview);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, User user) throws Exception {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new Exception("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new Exception("You are not authorized to delete this review");
        }

        reviewRepository.delete(review);
    }

    @Override
    public Review findReviewByOrderIdAndUserId(Long orderId, Long userId) {
        return reviewRepository.findByOrderIdAndUserId(orderId, userId).orElse(null);
    }


    // Helper methods
    private void validateReviewEligibility(User user, Order order) throws Exception {
        if (!order.getCustomer().getId().equals(user.getId())) {
            System.out.println("This order does not belong to the user");
            throw new BadRequestException("This order does not belong to the user");
        }

        if (!"DELIVERED".equalsIgnoreCase(order.getOrderStatus())) {
            System.out.println("Order must be delivered to leave a review");
            throw new BadRequestException("Order must be delivered to leave a review");
        }

        if (reviewRepository.existsByOrder(order)) {
            System.out.println("A review already exists for this order");
            throw new BadRequestException("A review already exists for this order");
        }
    }

    @Override
    public ReviewResponse mapToReviewResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setUserFullName(review.getUser().getFullName());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());
        return response;
    }


}
