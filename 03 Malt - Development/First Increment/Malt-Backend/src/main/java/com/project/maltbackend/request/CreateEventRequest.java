package com.project.maltbackend.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequest {
    private String title;
    private String description;
    private List<String> images;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long restaurantId;
}
