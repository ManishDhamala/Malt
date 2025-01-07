package com.project.maltbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private User customer;

    //@JsonIgnore
    @ManyToOne
    @JsonBackReference
    private Restaurant restaurant;

    private Long totalPrice;

    private String orderStatus;

    private Date createdAt;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Address deliveryAddress;

    @OneToMany
    private List<OrderItem> items;

//    private Payment payment;

    private int totalItem;  // Check this

   // private int totalPrice; // redundant


}
