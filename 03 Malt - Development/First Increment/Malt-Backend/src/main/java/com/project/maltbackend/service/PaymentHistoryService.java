package com.project.maltbackend.service;


import com.project.maltbackend.dto.PaymentDto;
import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.Payment;
import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PaymentHistoryService {


    private final PaymentRepository paymentRepository;
    private final ModelMapper modelMapper;

    public List<PaymentDto> getPaidPaymentsByUser(User user) {
        return paymentRepository.findAll().stream()
                .filter(p -> p.isPaid() && p.getOrder().getCustomer().getId().equals(user.getId()))
                .map(p -> modelMapper.map(p, PaymentDto.class))
                .collect(Collectors.toList());
    }

    public PaymentDto savePayment(PaymentDto paymentDto, Order order) {
        Payment payment = modelMapper.map(paymentDto, Payment.class);
        payment.setOrder(order);
        payment.setPaid("PAID".equalsIgnoreCase(payment.getStatus()));
        payment.setPaidAt(payment.isPaid() ? new Date() : null);

        Payment saved = paymentRepository.save(payment);
        return modelMapper.map(saved, PaymentDto.class);
    }


}
