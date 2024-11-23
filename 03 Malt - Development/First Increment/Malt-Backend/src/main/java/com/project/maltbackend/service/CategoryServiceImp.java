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



        @Override
        public Category createCategory(String name) throws Exception {

            Category category = new Category();
            category.setName(name);

            return categoryRepository.save(category);
        }



    @Override
    public List<Category> getAllCategoriesByRestaurantId(Long restaurantId) throws Exception {
            List<Category> categories = foodRepository.findDistinctCategoriesByRestaurantId(restaurantId);
            return categories;
    }

    @Override
    public Category findCategoryById(Long id) throws Exception {

        Optional<Category> optionalCategory = categoryRepository.findById(id);

        if(optionalCategory.isEmpty()){
            throw new Exception("Food category not found");
        }

        return optionalCategory.get();
    }
}
