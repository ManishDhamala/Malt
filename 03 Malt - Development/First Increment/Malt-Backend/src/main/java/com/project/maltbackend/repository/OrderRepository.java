package com.project.maltbackend.repository;

import com.project.maltbackend.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    public List<Order> findByCustomerId(Long userId);

    public List<Order> findByRestaurantId(Long restaurantId);

    List<Order> findByCustomerIdAndOrderStatusNot(Long customerId, String excludedStatus);

    List<Order> findByRestaurantIdAndOrderStatusNot(Long restaurantId, String excludedStatus);

    List<Order> findByRestaurantIdAndOrderStatus(Long restaurantId, String orderStatus);

    // Methods for pagination
    Page<Order> findByRestaurantId(Long restaurantId, Pageable pageable);
    Page<Order> findByRestaurantIdAndOrderStatusNot(Long restaurantId, String excludedStatus, Pageable pageable);
    Page<Order> findByRestaurantIdAndOrderStatus(Long restaurantId, String orderStatus, Pageable pageable);
}
