package com.project.maltbackend.repository;

import com.project.maltbackend.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository  extends JpaRepository<Cart, Long> {


}
