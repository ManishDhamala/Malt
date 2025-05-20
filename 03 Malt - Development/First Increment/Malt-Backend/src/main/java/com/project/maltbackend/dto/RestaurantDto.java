package com.project.maltbackend.dto;

import com.project.maltbackend.model.ContactInformation;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RestaurantDto {
    private Long id;
    private String name; // changed from title to match entity field
    private List<String> images;
    private String openingHours;
    private String description;
    private AddressDto address;
    private ContactInformation contactInformation; // Added from entity
    private boolean open; // Added from entity
    private Double averageRating; // Added for quick access to rating info
    private Integer totalReviews; // Added for statistics
}
