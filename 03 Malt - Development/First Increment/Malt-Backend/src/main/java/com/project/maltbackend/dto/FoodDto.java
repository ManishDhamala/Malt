package com.project.maltbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodDto {
    private Long id;
    private String name;
    private String Description;
    private Long price;
    private boolean isVegetarian;
    private boolean available;
    private List<String> images;

}
