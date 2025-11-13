package com.project.maltbackend.service;

import com.project.maltbackend.model.Category;
import com.project.maltbackend.model.Restaurant;
import com.project.maltbackend.repository.CategoryRepository;
import com.project.maltbackend.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImp implements CategoryService{

    private final CategoryRepository categoryRepository;

    // Constructor Injection
    public CategoryServiceImp(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

        @Override
        public Category createCategory(String name, Restaurant restaurant) throws Exception {

            if (restaurant == null) {
                throw new Exception("Restaurant not found");
            }

            Category category = new Category();
            category.setName(name);
            category.setRestaurant(restaurant);

            return categoryRepository.save(category);
        }



    @Override
    public List<Category> getAllCategoriesByRestaurantId(Long restaurantId) throws Exception {

            // Find all categories by restaurant Id where deleted = false
            return categoryRepository.findByRestaurantIdAndDeletedFalse(restaurantId);
    }

    @Override
    public Category findCategoryById(Long id) throws Exception {

        Optional<Category> optionalCategory = categoryRepository.findById(id);

        if(optionalCategory.isEmpty()){
            throw new Exception("Food category not found");
        }

        return optionalCategory.get();
    }

    @Override
    public void deleteFoodCategory(Long categoryId) throws Exception {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new Exception("Category not found"));

        // Soft delete
        category.setDeleted(true);
        category.setDeletedAt(new Date());
        categoryRepository.save(category);
    }
}
