package com.project.maltbackend.repository;

import com.project.maltbackend.model.CartItem;
import com.project.maltbackend.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {


    List<CartItem> findByCartId(Long id);

    void deleteByFood(Food food);
}
