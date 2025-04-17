package com.project.maltbackend.repository;

import com.project.maltbackend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    public List<Order> findByCustomerId(Long userId);

    public List<Order> findByRestaurantId(Long restaurantId);

    List<Order> findByCustomerIdAndOrderStatusNot(Long customerId, String excludedStatus);



}
