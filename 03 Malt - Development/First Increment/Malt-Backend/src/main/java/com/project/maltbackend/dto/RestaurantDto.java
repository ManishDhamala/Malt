package com.project.maltbackend.dto;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Embeddable  //Not a standalone entity but an embedded part of another entity
public class RestaurantDto {

    private Long id;

    private String title;

    @Column(length = 1000)
    private List<String> images;

    private String openingHours;

    private String description;

}
