package com.project.maltbackend.repository;

import com.project.maltbackend.model.Category;
import com.project.maltbackend.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {

    // Include deleted food too
    List<Food> findByRestaurantId(Long restaurantId);

    // Exclude deleted food
    List<Food> findByRestaurantIdAndDeletedFalse(Long restaurantId);

    // Find including deleted
    Optional<Food> findByIdAndDeletedFalse(Long id);

    //Case Sensitive
//    @Query("SELECT f FROM Food f WHERE f.name LIKE %:KEYWORD% OR f.foodCategory.name LIKE %:keyword%")
//    List<Food> searchFood(@Param("keyword") String keyword);

    // Custom JPQL query to search foods by name, case-insensitive.
    @Query("SELECT f FROM Food f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(f.foodCategory.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Food> searchFood(@Param("keyword") String keyword);


    // Custom JPQL query to get all food categories associated with a restaurant
    @Query("SELECT DISTINCT f.foodCategory FROM Food f WHERE f.restaurant.id = :restaurantId")
    List<Category> findDistinctCategoriesByRestaurantId(@Param("restaurantId") Long restaurantId);

}
