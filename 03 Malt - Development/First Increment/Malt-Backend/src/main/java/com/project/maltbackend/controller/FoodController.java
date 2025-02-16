package com.project.maltbackend.controller;

import com.project.maltbackend.model.Food;
import com.project.maltbackend.model.Restaurant;
import com.project.maltbackend.model.User;
import com.project.maltbackend.service.FoodService;
import com.project.maltbackend.service.RestaurantService;
import com.project.maltbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/search")
    public ResponseEntity<List<Food>> searchFood(@RequestParam String name,
                                           @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        List<Food> foods = foodService.searchFood(name);

        return new ResponseEntity<>(foods, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Food>> getRestaurantFood(@RequestParam (required = false) Boolean vegetarian,
                                                 @RequestParam(required = false) String foodCategory,
                                                 @PathVariable Long restaurantId,
                                                 @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        List<Food> foods = foodService.getRestaurantsFood(restaurantId,vegetarian,foodCategory);

        return new ResponseEntity<>(foods, HttpStatus.OK);
    }




}
