package com.project.maltbackend.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteRestaurant {
    private Long id;

    private String title;

    @Column(length = 1000)
    private List<String> images;

    private String description;

}
