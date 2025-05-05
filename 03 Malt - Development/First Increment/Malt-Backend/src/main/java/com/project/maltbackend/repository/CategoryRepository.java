package com.project.maltbackend.repository;

import com.project.maltbackend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Exclude deleted categories
    List<Category> findByRestaurantIdAndDeletedFalse(Long restaurantId);

    // Include deleted categories when needed
    List<Category> findByRestaurantId(Long restaurantId);

    // Find including deleted
    Optional<Category> findByIdAndDeletedFalse(Long id);

}
