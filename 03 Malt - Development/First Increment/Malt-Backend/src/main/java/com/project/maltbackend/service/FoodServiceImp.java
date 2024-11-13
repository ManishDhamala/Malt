package com.project.maltbackend.service;

import com.project.maltbackend.model.Category;
import com.project.maltbackend.model.Food;
import com.project.maltbackend.model.Restaurant;
import com.project.maltbackend.repository.FoodRepository;
import com.project.maltbackend.request.CreateFoodRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FoodServiceImp implements FoodService {

    @Autowired  // Injecting an instance of FoodRepository to access the database
    private FoodRepository foodRepository;

    @Override
    public Food createFood(CreateFoodRequest request, Category category, Restaurant restaurant) {
        // Creating a new Food object
        Food food = new Food();

        // Set the food's category and associated restaurant
        food.setFoodCategory(category);
        food.setRestaurant(restaurant);

        // Set food properties from the CreateFoodRequest
        food.setDescription(request.getDescription());
        food.setImages(request.getImages());
        food.setName(request.getName());
        food.setPrice(request.getPrice());
        food.setVegetarian(request.isVegetarian());
        food.setCreationDate(new Date());  // Set the current date as the creation date

        // Save the new food item to the database
        Food savedFood = foodRepository.save(food);

        // Add the newly created food to the restaurant's food list
        restaurant.getFoods().add(savedFood);

        return savedFood;  // Return the saved food item
    }

    @Override
    public void deleteFood(Long foodId) throws Exception {
        // Find the food by ID, or throw an exception if not found
        Food food = findFoodById(foodId);

        // Disassociate the food from its restaurant before deletion
        food.setRestaurant(null);

        // Save the food with the disassociation change (soft delete approach)
        foodRepository.save(food);
    }

    @Override
    public List<Food> getRestaurantsFood(Long restaurantId, Boolean isVegetarian, String foodCategory) throws Exception {
        // Fetch all food items for a specific restaurant by its ID
        List<Food> foods = foodRepository.findByRestaurantId(restaurantId);

        // If isVegetarian is not null, filter foods by vegetarian status (True = veg and False = non-veg)
        if(isVegetarian != null){
            foods = filterByVegetarian(foods, isVegetarian);
        }

        // If foodCategory is not null or empty, filter foods by category
        if(foodCategory != null && !foodCategory.isEmpty()){
            foods = filterByCategory(foods, foodCategory);
        }

        return foods;  // Return the filtered list of food items
    }

    // Filters foods by category name
    private List<Food> filterByCategory(List<Food> foods, String foodCategory) {
        return foods.stream().filter(food -> {
            // Check if food's category exists and matches the provided category name
            if(food.getFoodCategory() != null){
                return food.getFoodCategory().getName().equals(foodCategory);
            }
            return false;
        }).collect(Collectors.toList());
    }

    // Filters foods by vegetarian status
    private List<Food> filterByVegetarian(List<Food> foods, Boolean isVegetarian) {
        return foods.stream()
                .filter(food -> food.isVegetarian() == isVegetarian)
                .collect(Collectors.toList());
    }

    @Override
    public List<Food> searchFood(String keyword) {
        // Search for foods in the repository using a keyword
        return foodRepository.searchFood(keyword);
    }

    @Override
    public Food findFoodById(Long foodId) throws Exception {
        // Try to find the food by ID
        Optional<Food> optionalFood = foodRepository.findById(foodId);

        // If not found, throw an exception
        if(optionalFood.isEmpty()){
            throw new Exception("Food not found");
        }

        return optionalFood.get();  // Return the found food item
    }

    @Override
    public Food updateAvailabilityStatus(Long foodId) throws Exception {
        // Find the food by ID or throw an exception if not found
        Food food = findFoodById(foodId);

        // Toggle the food's availability status
        food.setAvailable(!food.isAvailable());

        // Save and return the updated food
        return foodRepository.save(food);
    }
}

