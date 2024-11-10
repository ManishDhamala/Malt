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

    @Autowired
    private FoodRepository foodRepository;



    @Override
    public Food createFood(CreateFoodRequest request, Category category, Restaurant restaurant) {
        Food food = new Food();
        food.setFoodCategory(category);
        food.setRestaurant(restaurant);

        food.setDescription(request.getDescription());
        food.setImages(request.getImages());
        food.setName(request.getName());
        food.setPrice(request.getPrice());
        food.setVegetarian(request.isVegetarian());
        food.setCreationDate(new Date());

         Food savedFood = foodRepository.save(food);
         restaurant.getFoods().add(savedFood);

         return savedFood;
    }

    @Override
    public void deleteFood(Long foodId) throws Exception {

        Food food = findFoodById(foodId);
        food.setRestaurant(null);

        foodRepository.save(food);

    }



    @Override
    public List<Food> getRestaurantsFood(Long restaurantId, Boolean isVegetarian, String foodCategory) throws Exception {

        List<Food> foods = foodRepository.findByRestaurantId(restaurantId);

        // If isVegetarian is true, it filters for vegetarian food / if false, it filters for non-veg food.
        // Boolean wrapper class can be null
        if(isVegetarian != null){  // [Check if isVegetarian is specified]
            foods = filterByVegetarian(foods, isVegetarian);
        }

        if(foodCategory != null && !foodCategory.isEmpty()){
            foods = filterByCategory(foods, foodCategory);
        }

        return foods;
    }

    private List<Food> filterByCategory(List<Food> foods, String foodCategory) {
        return foods.stream().filter(food -> {
            if(food.getFoodCategory() != null){
                return food.getFoodCategory().getName().equals(foodCategory);
            }
            return false;
        }).collect(Collectors.toList());
    }

    private List<Food> filterByVegetarian(List<Food> foods, Boolean isVegetarian) {
        return foods.stream().filter(food -> food.isVegetarian() == isVegetarian).collect(Collectors.toList());
    }




    @Override
    public List<Food> searchFood(String keyword) {
        return foodRepository.searchFood(keyword);
    }

    @Override
    public Food findFoodById(Long foodId) throws Exception {
        Optional<Food> optionalFood = foodRepository.findById(foodId);

        if(optionalFood.isEmpty()){
            throw new Exception("Food not found");
        }

        return optionalFood.get();
    }

    @Override
    public Food updateAvailabilityStatus(Long foodId) throws Exception {
        Food food = findFoodById(foodId);
        food.setAvailable(!food.isAvailable());
        return foodRepository.save(food);
    }
}
