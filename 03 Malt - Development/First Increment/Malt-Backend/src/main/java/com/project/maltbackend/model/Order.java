package com.project.maltbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties("orders") // Ignore 'orders' field in User when serializing
    private User customer;

    //@JsonIgnore
    @ManyToOne
    @JsonIgnoreProperties("orders")
    private Restaurant restaurant;

    private Long totalPrice;

    private String orderStatus;

    private Date createdAt;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Address deliveryAddress;

    @OneToMany
    private List<OrderItem> items;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Payment payment;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonIgnore
    private Review review;

}
