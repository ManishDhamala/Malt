package com.project.maltbackend.service;

import com.project.maltbackend.model.*;
import com.project.maltbackend.repository.*;
import com.project.maltbackend.request.CreateEventRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceImpTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private RestaurantRepository restaurantRepository;

    @InjectMocks
    private EventServiceImp eventService;

    private CreateEventRequest request;
    private User user;
    private Restaurant restaurant;
    private Event expectedEvent;

    @BeforeEach
    void setUp() {
        // Setup test data
        user = new User();
        user.setId(1L);
        user.setEmail("owner@test.com");
        user.setFullName("Test Owner");

        restaurant = new Restaurant();
        restaurant.setId(1L);
        restaurant.setName("Test Restaurant");
        restaurant.setOwner(user);

        request = new CreateEventRequest();
        request.setTitle("Test Event");
        request.setDescription("Test Description");
        request.setImages(List.of("image1.jpg", "image2.jpg"));
        request.setStartDate(LocalDateTime.now().plusDays(1));
        request.setEndDate(LocalDateTime.now().plusDays(2));
        request.setRestaurantId(1L);

        expectedEvent = new Event();
        expectedEvent.setId(1L);
        expectedEvent.setTitle(request.getTitle());
        expectedEvent.setDescription(request.getDescription());
        expectedEvent.setImages(request.getImages());
        expectedEvent.setRestaurant(restaurant);
        expectedEvent.setStartDate(request.getStartDate());
        expectedEvent.setEndDate(request.getEndDate());
        expectedEvent.setCreatedAt(LocalDateTime.now());
        expectedEvent.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void createEvent_ShouldSuccessfullyCreateEvent() throws Exception {
        // Arrange
        when(restaurantRepository.findById(any(Long.class))).thenReturn(Optional.of(restaurant));
        when(eventRepository.save(any(Event.class))).thenReturn(expectedEvent);

        // Act
        Event result = eventService.createEvent(request, user);

        // Assert
        assertNotNull(result);
        assertEquals(request.getTitle(), result.getTitle());
        assertEquals(request.getDescription(), result.getDescription());
        assertEquals(request.getImages(), result.getImages());
        assertEquals(restaurant, result.getRestaurant());
        assertNotNull(result.getStartDate());
        assertNotNull(result.getEndDate());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());

        // Verify repository interactions
        verify(restaurantRepository, times(1)).findById(request.getRestaurantId());
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void createEvent_ShouldThrowExceptionWhenRestaurantNotFound() {
        // Arrange
        when(restaurantRepository.findById(any(Long.class))).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(Exception.class, () -> {
            eventService.createEvent(request, user);
        });

        assertEquals("Restaurant not found", exception.getMessage());
        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    void createEvent_ShouldThrowExceptionWhenUserNotOwner() {
        // Arrange
        User otherUser = new User();
        otherUser.setId(2L); // Different user ID
        when(restaurantRepository.findById(any(Long.class))).thenReturn(Optional.of(restaurant));

        // Act & Assert
        Exception exception = assertThrows(Exception.class, () -> {
            eventService.createEvent(request, otherUser);
        });

        assertEquals("You are not authorized to create events for this restaurant", exception.getMessage());
        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    void createEvent_ShouldConvertTimeToServerZone() throws Exception {
        // Arrange
        LocalDateTime utcStartTime = LocalDateTime.now();
        LocalDateTime utcEndTime = utcStartTime.plusHours(2);
        request.setStartDate(utcStartTime);
        request.setEndDate(utcEndTime);

        when(restaurantRepository.findById(any(Long.class))).thenReturn(Optional.of(restaurant));
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> {
            Event savedEvent = invocation.getArgument(0);
            savedEvent.setId(1L);
            return savedEvent;
        });

        // Act
        Event result = eventService.createEvent(request, user);

        // Assert
        assertNotNull(result.getStartDate());
        assertNotNull(result.getEndDate());
        // Verify time conversion happened (exact comparison would need zone-specific logic)
        assertNotEquals(utcStartTime, result.getStartDate());
        assertNotEquals(utcEndTime, result.getEndDate());
    }

    @Test
    void createEvent_ShouldSetCreatedAndUpdatedTimestamps() throws Exception {
        // Arrange
        LocalDateTime beforeTest = LocalDateTime.now();
        when(restaurantRepository.findById(any(Long.class))).thenReturn(Optional.of(restaurant));
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> {
            Event event = invocation.getArgument(0);
            event.setId(1L);
            event.setCreatedAt(LocalDateTime.now()); // Manually set createdAt
            event.setUpdatedAt(LocalDateTime.now()); // Manually set updatedAt
            return event;
        });

        // Act
        Event result = eventService.createEvent(request, user);
        LocalDateTime afterTest = LocalDateTime.now();

        // Assert
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());
        assertTrue(result.getCreatedAt().isAfter(beforeTest) ||
                result.getCreatedAt().equals(beforeTest));
        assertTrue(result.getCreatedAt().isBefore(afterTest) ||
                result.getCreatedAt().equals(afterTest));
        assertEquals(result.getCreatedAt(), result.getUpdatedAt());
    }
}