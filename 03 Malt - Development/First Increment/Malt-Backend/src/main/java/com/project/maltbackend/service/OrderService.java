package com.project.maltbackend.service;

import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.User;
import com.project.maltbackend.request.OrderRequest;

import java.util.List;

public interface OrderService {

    public Order createOrder(OrderRequest request, User user) throws Exception;

    public Order updateOrder(Long orderId, String orderStatus) throws Exception;

    public void cancelOrder(Long orderId) throws Exception;

    public List<Order> getUsersOrders(Long userId) throws Exception;

    public List<Order> getRestaurantsOrders(Long restaurantId, String orderStatus) throws Exception;

    public Order findOrderById(Long orderId) throws Exception;


}
