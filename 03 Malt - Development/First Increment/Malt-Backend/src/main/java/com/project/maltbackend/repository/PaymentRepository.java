package com.project.maltbackend.repository;

import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository  extends JpaRepository<Payment, Long> {

    Payment findByOrder(Order order);


}
