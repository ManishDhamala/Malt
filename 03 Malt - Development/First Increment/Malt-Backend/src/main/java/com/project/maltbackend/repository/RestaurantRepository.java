package com.project.maltbackend.repository;

import com.project.maltbackend.dto.RestaurantDto;
import com.project.maltbackend.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    // Custom query method to find a Restaurant by the owner's user ID.
    Restaurant findByOwnerId(Long userId);

    // Custom JPQL query to search for restaurants by name, case-insensitive.
    @Query("SELECT r FROM Restaurant r WHERE lower(r.name) LIKE lower(concat('%',:query,'%') ) ")
    List<Restaurant> findBySearchQuery(String query);

}
