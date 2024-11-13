package com.project.maltbackend.controller;

import com.project.maltbackend.model.Category;
import com.project.maltbackend.model.User;
import com.project.maltbackend.service.CategoryService;
import com.project.maltbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    //  Endpoint for creating new category
    @PostMapping("/admin/category")
    public ResponseEntity<Category> createCategory(@RequestBody Category category,
                                                   @RequestHeader("Authorization") String jwt) throws Exception {

        // Retrieves the user based on the JWT token in the Authorization header
        User user = userService.findUserByJwtToken(jwt);

        // Creates a new category using the category's name and the user's ID
        Category createdCategory = categoryService.createCategory(category.getName(), user.getId());

        // Returns the created category in the response body with a 201 CREATED status
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);

    }

    // Endpoint to fetch all categories associated with a specific restaurant
    @GetMapping("/category/restaurant")
    public ResponseEntity<List<Category>> getRestaurantCategory(@RequestHeader("Authorization") String jwt) throws Exception {

        // Retrieves the user based on the JWT token in the Authorization header
        User user = userService.findUserByJwtToken(jwt);

        // Finds categories associated with the restaurant ID that matches the user's ID
        List<Category> categories = categoryService.findCategoryByRestaurantId(user.getId());

        // Returns the list of categories in the response body with a 200 OK status
        return new ResponseEntity<>(categories, HttpStatus.OK);

    }



}
