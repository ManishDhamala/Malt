package com.project.maltbackend.service;

import com.project.maltbackend.dto.OrderDto;
import com.project.maltbackend.dto.PaginatedResponse;
import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.User;
import com.project.maltbackend.request.OrderRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderService {

    public Object createOrder(OrderRequest request, User user) throws Exception;

    public Order updateOrder(Long orderId, String orderStatus) throws Exception;

    public void cancelOrder(Long orderId) throws Exception;

    public List<OrderDto> getUsersOrders(Long userId) throws Exception;

    // public List<OrderDto> getRestaurantsOrders(Long restaurantId, String orderStatus) throws Exception;

    public PaginatedResponse<OrderDto> getRestaurantsOrders(
            Long restaurantId,
            String orderStatus,
            Integer year,
            Integer month,
            int page,
            int size) throws Exception;

    public Order findOrderById(Long orderId) throws Exception;


}
