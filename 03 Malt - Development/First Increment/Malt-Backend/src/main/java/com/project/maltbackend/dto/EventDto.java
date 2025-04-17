package com.project.maltbackend.dto;

import com.project.maltbackend.model.Address;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
    private Long id;
    private Long restaurantId;
    private String restaurantName;
    private String title;
    private String description;
    private List<String> images;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Address address;
}
