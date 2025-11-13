package com.project.maltbackend.controller;

import com.project.maltbackend.dto.EventDto;
import com.project.maltbackend.model.Event;
import com.project.maltbackend.model.Restaurant;
import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.RestaurantRepository;
import com.project.maltbackend.request.CreateEventRequest;
import com.project.maltbackend.service.EventService;
import com.project.maltbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin/events")
public class AdminEventController {

    private final EventService eventService;

    private final UserService userService;

    private final RestaurantRepository restaurantRepository;

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody CreateEventRequest req, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Event event = eventService.createEvent(req, user);
        return new ResponseEntity<>(event, HttpStatus.CREATED);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long eventId, @RequestBody CreateEventRequest req, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Event event = eventService.updateEvent(eventId, req, user);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable Long eventId, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        String message = eventService.deleteEvent(eventId, user);

        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/restaurant")
    public ResponseEntity<List<EventDto>> getRestaurantEvents(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Restaurant restaurant = restaurantRepository.findByOwnerId(user.getId());

        if (restaurant == null) {
            throw new Exception("You don't have a restaurant");
        }

        List<EventDto> events = eventService.getRestaurantEvents(restaurant.getId());
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
}
