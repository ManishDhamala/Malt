package com.project.maltbackend.controller;

import com.project.maltbackend.model.Category;
import com.project.maltbackend.model.Food;
import com.project.maltbackend.model.Restaurant;
import com.project.maltbackend.model.User;
import com.project.maltbackend.request.CreateFoodRequest;
import com.project.maltbackend.request.CreateRestaurantRequest;
import com.project.maltbackend.response.MessageResponse;
import com.project.maltbackend.service.CategoryService;
import com.project.maltbackend.service.FoodService;
import com.project.maltbackend.service.RestaurantService;
import com.project.maltbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/food")
public class AdminFoodController {

    @Autowired
    private FoodService foodService;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<Food> createFood(@RequestBody CreateFoodRequest request,
                                           @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantService.findRestaurantById(request.getRestaurantId());
        Category category = categoryService.findCategoryById(request.getCategoryId());

        Food food = foodService.createFood(request, category, restaurant);

        return new ResponseEntity<>(food, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteFood(@PathVariable Long id,
                                                      @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        foodService.deleteFood(id);

        MessageResponse response = new MessageResponse();
        response.setMessage("Food Deleted Successfully");


        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Food> updateFoodAvailabilityStatus(@PathVariable Long id,
                                                      @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Food food = foodService.updateAvailabilityStatus(id);

        return new ResponseEntity<>(food, HttpStatus.OK);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<Food> updateFood(
            @RequestBody CreateFoodRequest req,
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id
    ) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Food food = foodService.updateFood(id, req);

        return new ResponseEntity<>(food, HttpStatus.OK);
    }







}
