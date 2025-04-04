package com.project.maltbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String paymentMethod; // STRIPE, ESEWA, COD
    private String status; // PENDING, PAID, FAILED
    private boolean paid;

    private String transactionId; // Stripe session ID, eSewa ref ID, etc.
    private Date paidAt;

    @OneToOne
    private Order order;

    private Long amount;

}
