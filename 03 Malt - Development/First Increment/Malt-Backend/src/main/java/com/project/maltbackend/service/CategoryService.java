package com.project.maltbackend.service;

import com.project.maltbackend.model.Category;
import com.project.maltbackend.model.Restaurant;

import java.util.List;

public interface CategoryService {

    public Category createCategory(String name, Restaurant restaurant) throws Exception;

    public List<Category> getAllCategoriesByRestaurantId(Long restaurantId) throws Exception;

    public Category findCategoryById(Long id) throws Exception;


}
