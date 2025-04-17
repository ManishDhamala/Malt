package com.project.maltbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {
    private Long id;
    private String paymentMethod;
    private boolean paid;
    private String status;
    private Date paidAt;
    private Long amount;
    private Long orderId;

}
