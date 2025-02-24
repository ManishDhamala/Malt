package com.project.maltbackend.request;

import lombok.Data;

@Data
public class CreateCategoryRequest {

    private String name;
    private Long restaurantId;
}
