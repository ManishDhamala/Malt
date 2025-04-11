package com.project.maltbackend.repository;

import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PaymentRepository  extends JpaRepository<Payment, Long> {

    Payment findByOrder(Order order);

    Payment findByTransactionId(String transactionId);

    Payment findFirstByPaidFalseOrderByIdDesc();
}
