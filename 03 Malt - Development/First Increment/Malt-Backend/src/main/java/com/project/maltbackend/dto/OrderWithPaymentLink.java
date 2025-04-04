package com.project.maltbackend.dto;

import com.project.maltbackend.model.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderWithPaymentLink {

    private Order order;
    private String paymentUrl;
}