package com.project.maltbackend.service;

import com.project.maltbackend.model.*;
import com.project.maltbackend.repository.CategoryRepository;
import com.project.maltbackend.repository.FoodRepository;
import com.project.maltbackend.request.CreateFoodRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FoodServiceImpTest {

    @Mock
    private FoodRepository foodRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private FoodServiceImp foodService;

    private CreateFoodRequest request;
    private Category category;
    private Restaurant restaurant;
    private Food expectedFood;

    @BeforeEach
    void setUp() {
        // Setup test data
        restaurant = new Restaurant();
        restaurant.setId(1L);
        restaurant.setName("Test Restaurant");
        restaurant.setFoods(new ArrayList<>());

        category = new Category();
        category.setId(1L);
        category.setName("Test Category");
        category.setRestaurant(restaurant);

        request = new CreateFoodRequest();
        request.setName("Test Food");
        request.setDescription("Test Description");
        request.setPrice(1000L);
        request.setImages(Arrays.asList("image1.jpg", "image2.jpg"));
        request.setVegetarian(true);

        expectedFood = new Food();
        expectedFood.setId(1L);
        expectedFood.setName(request.getName());
        expectedFood.setDescription(request.getDescription());
        expectedFood.setPrice(request.getPrice());
        expectedFood.setImages(request.getImages());
        expectedFood.setVegetarian(request.isVegetarian());
        expectedFood.setFoodCategory(category);
        expectedFood.setRestaurant(restaurant);
        expectedFood.setCreationDate(new Date());
    }

    @Test
    void createFood_ShouldSuccessfullyCreateFood() {
        // Arrange
        when(foodRepository.save(any(Food.class))).thenReturn(expectedFood);

        // Act
        Food result = foodService.createFood(request, category, restaurant);

        // Assert
        assertNotNull(result);
        assertEquals(request.getName(), result.getName());
        assertEquals(request.getDescription(), result.getDescription());
        assertEquals(request.getPrice(), result.getPrice());
        assertEquals(request.getImages(), result.getImages());
        assertEquals(request.isVegetarian(), result.isVegetarian());
        assertEquals(category, result.getFoodCategory());
        assertEquals(restaurant, result.getRestaurant());
        assertNotNull(result.getCreationDate());

        // Verify repository interaction
        verify(foodRepository, times(1)).save(any(Food.class));

        // Verify restaurant's food list was updated
        assertTrue(restaurant.getFoods().contains(result));
        assertEquals(1, restaurant.getFoods().size());
    }

    @Test
    void createFood_ShouldSetCorrectProperties() {
        // Arrange
        when(foodRepository.save(any(Food.class))).thenAnswer(invocation -> {
            Food savedFood = invocation.getArgument(0);
            savedFood.setId(1L); // Simulate DB auto-generation
            return savedFood;
        });

        // Act
        Food result = foodService.createFood(request, category, restaurant);

        // Assert
        assertNotNull(result.getId());
        assertEquals(request.getName(), result.getName());
        assertEquals(category, result.getFoodCategory());
        assertEquals(restaurant, result.getRestaurant());
        assertTrue(result.isAvailable()); // Should be true by default
    }

    @Test
    void createFood_ShouldAddFoodToRestaurantList() {
        // Arrange
        when(foodRepository.save(any(Food.class))).thenReturn(expectedFood);
        int initialFoodCount = restaurant.getFoods().size();

        // Act
        Food result = foodService.createFood(request, category, restaurant);

        // Assert
        assertEquals(initialFoodCount + 1, restaurant.getFoods().size());
        assertTrue(restaurant.getFoods().contains(result));
    }
}