package com.project.maltbackend.controller;

import com.project.maltbackend.model.Category;
import com.project.maltbackend.model.Restaurant;
import com.project.maltbackend.model.User;
import com.project.maltbackend.request.CreateCategoryRequest;
import com.project.maltbackend.response.MessageResponse;
import com.project.maltbackend.service.CategoryService;
import com.project.maltbackend.service.RestaurantService;
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

    @Autowired
    private RestaurantService restaurantService;

    //  Endpoint for creating new category
    @PostMapping("/admin/category")
    public ResponseEntity<Category> createCategory(@RequestHeader("Authorization") String jwt,
                                                   @RequestBody CreateCategoryRequest categoryRequest) throws Exception {

        // Retrieves the user based on the JWT token in the Authorization header
//        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantService.findRestaurantById(categoryRequest.getRestaurantId());

        // Creates a new category using the category's name and the user's ID
        Category createdCategory = categoryService.createCategory(categoryRequest.getName(), restaurant);

        // Returns the created category in the response body with a 201 CREATED status
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);

    }

    // Endpoint to fetch all categories associated with a specific restaurant
    @GetMapping("/category/restaurant/{id}")
    public ResponseEntity<List<Category>> getRestaurantCategories(
            @PathVariable Long id
//            @RequestHeader("Authorization") String jwt
           )
            throws Exception {

        // Retrieves the user based on the JWT token in the Authorization header
//        User user = userService.findUserByJwtToken(jwt);

        // Finds all categories by the restaurant's ID
        List<Category> categories = categoryService.getAllCategoriesByRestaurantId(id);

        // Returns the list of categories in the response body with a 200 OK status
        return new ResponseEntity<>(categories, HttpStatus.OK);

    }

    @DeleteMapping("/admin/category/{id}")
    public ResponseEntity<MessageResponse> deleteFoodCategory(@PathVariable Long id,
                                                      @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        categoryService.deleteFoodCategory(id);

        MessageResponse response = new MessageResponse();
        response.setMessage("Food Category Deleted Successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }



}
