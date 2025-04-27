package com.project.maltbackend.service;

import com.project.maltbackend.model.Category;
import com.project.maltbackend.model.Restaurant;
import com.project.maltbackend.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImpTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImp categoryService;

    private Restaurant testRestaurant;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testRestaurant = new Restaurant();
        testRestaurant.setId(1L);
        testRestaurant.setName("Test Restaurant");

        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Test Category");
        testCategory.setRestaurant(testRestaurant);
    }

    @Test
    void createCategory_Success() throws Exception {
        // Arrange
        String categoryName = "Test Category";
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);

        // Act
        Category result = categoryService.createCategory(categoryName, testRestaurant);

        // Assert
        assertNotNull(result);
        assertEquals(categoryName, result.getName());
        assertEquals(testRestaurant, result.getRestaurant());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void createCategory_ThrowsExceptionWhenRestaurantIsNull() {
        // Arrange
        String categoryName = "Test Category";

        // Act & Assert
        Exception exception = assertThrows(Exception.class, () -> {
            categoryService.createCategory(categoryName, null);
        });

        assertEquals("Restaurant not found", exception.getMessage());
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void createCategory_VerifyCategoryProperties() throws Exception {
        // Arrange
        String categoryName = "New Category";
        Category savedCategory = new Category();
        savedCategory.setName(categoryName);
        savedCategory.setRestaurant(testRestaurant);

        when(categoryRepository.save(any(Category.class))).thenReturn(savedCategory);

        // Act
        Category result = categoryService.createCategory(categoryName, testRestaurant);

        // Assert
        assertNotNull(result);
        assertEquals(categoryName, result.getName());
        assertEquals(testRestaurant, result.getRestaurant());
        assertNull(result.getId());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }
}