package com.project.maltbackend.service;

import com.project.maltbackend.dto.EventDto;
import com.project.maltbackend.model.Event;
import com.project.maltbackend.model.User;
import com.project.maltbackend.request.CreateEventRequest;

import java.util.List;

public interface EventService {
    Event createEvent(CreateEventRequest req, User user) throws Exception;

    Event updateEvent(Long eventId, CreateEventRequest req, User user) throws Exception;

    List<EventDto> getAllEvents();

    List<EventDto> getActiveEvents();

    List<EventDto> getRestaurantEvents(Long restaurantId);

    EventDto getEventById(Long eventId) throws Exception;

    String deleteEvent(Long eventId, User user) throws Exception;
}
