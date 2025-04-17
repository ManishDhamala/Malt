package com.project.maltbackend.repository;

import com.project.maltbackend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByRestaurantId(Long restaurantId);

    @Query("SELECT e FROM Event e WHERE e.endDate >= :currentDate ORDER BY e.startDate ASC")
    List<Event> findAllActiveEvents(LocalDateTime currentDate);

    @Query("SELECT e FROM Event e WHERE e.restaurant.id = :restaurantId AND e.endDate >= :currentDate ORDER BY e.startDate ASC")
    List<Event> findActiveEventsByRestaurantId(Long restaurantId, LocalDateTime currentDate);
}
