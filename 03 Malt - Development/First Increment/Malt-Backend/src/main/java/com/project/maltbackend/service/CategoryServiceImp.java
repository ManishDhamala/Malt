package com.project.maltbackend.service;

import com.project.maltbackend.model.Category;
import com.project.maltbackend.model.Restaurant;
import com.project.maltbackend.repository.CategoryRepository;
import com.project.maltbackend.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImp implements CategoryService{

    @Autowired
    private CategoryRepository categoryRepository;


    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private RestaurantService restaurantService;



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
            return categoryRepository.findByRestaurantId(restaurantId);
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
        categoryRepository.deleteById(categoryId);
    }
}
