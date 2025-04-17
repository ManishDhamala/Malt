package com.project.maltbackend.service;

import com.project.maltbackend.dto.EventDto;
import com.project.maltbackend.model.Event;
import com.project.maltbackend.model.Restaurant;
import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.EventRepository;
import com.project.maltbackend.repository.RestaurantRepository;
import com.project.maltbackend.request.CreateEventRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventServiceImp implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    public Event createEvent(CreateEventRequest req, User user) throws Exception {
        Restaurant restaurant = restaurantRepository.findById(req.getRestaurantId())
                .orElseThrow(() -> new Exception("Restaurant not found"));

        // Check if user is the owner of the restaurant
        if (!restaurant.getOwner().getId().equals(user.getId())) {
            throw new Exception("You are not authorized to create events for this restaurant");
        }

        Event event = new Event();
        event.setRestaurant(restaurant);
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setImages(req.getImages());
        event.setStartDate(req.getStartDate());
        event.setEndDate(req.getEndDate());

        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Long eventId, CreateEventRequest req, User user) throws Exception {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new Exception("Event not found"));

        // Check if user is the owner of the restaurant
        if (!event.getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new Exception("You are not authorized to update this event");
        }

        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setImages(req.getImages());
        event.setStartDate(req.getStartDate());
        event.setEndDate(req.getEndDate());

        return eventRepository.save(event);
    }

    @Transactional
    @Override
    public List<EventDto> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return events.stream().map(this::mapToEventDto).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public List<EventDto> getActiveEvents() {
        List<Event> events = eventRepository.findAllActiveEvents(LocalDateTime.now());
        return events.stream().map(this::mapToEventDto).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public List<EventDto> getRestaurantEvents(Long restaurantId) {
        List<Event> events = eventRepository.findByRestaurantId(restaurantId);
        return events.stream().map(this::mapToEventDto).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public EventDto getEventById(Long eventId) throws Exception {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new Exception("Event not found"));
        return mapToEventDto(event);
    }

    @Override
    public String deleteEvent(Long eventId, User user) throws Exception {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new Exception("Event not found"));

        // Check if user is the owner of the restaurant
        if (!event.getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new Exception("You are not authorized to delete this event");
        }

        eventRepository.delete(event);
        return "Event deleted successfully";
    }

    private EventDto mapToEventDto(Event event) {
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setRestaurantId(event.getRestaurant().getId());
        dto.setRestaurantName(event.getRestaurant().getName());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setImages(event.getImages());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setAddress(event.getRestaurant().getAddress());
        return dto;
    }
}
