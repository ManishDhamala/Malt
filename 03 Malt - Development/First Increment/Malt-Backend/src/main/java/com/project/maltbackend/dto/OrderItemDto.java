package com.project.maltbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {

    private Long id;
    private int quantity;
    private FoodDto food;
    private Long totalPrice;

}
