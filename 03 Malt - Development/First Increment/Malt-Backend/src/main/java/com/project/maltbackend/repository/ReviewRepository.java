package com.project.maltbackend.repository;

import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByOrder(Order order);

    List<Review> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.restaurant.id = :restaurantId")
    Double calculateAverageRatingByRestaurantId(@Param("restaurantId") Long restaurantId);

    Optional<Review> findByOrderIdAndUserId(Long orderId, Long userId);

}
