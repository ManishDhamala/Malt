package com.project.maltbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private UserDto user;
    private RestaurantDto restaurant;
    private Long totalPrice;
    private String orderStatus;
    private Date createdAt;
    private AddressDto deliveryAddress;
    private List<OrderItemDto> items;
    private PaymentDto payment;
    private boolean canReview;
}
