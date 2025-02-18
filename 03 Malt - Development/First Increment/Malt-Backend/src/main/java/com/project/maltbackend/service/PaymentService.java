package com.project.maltbackend.service;

import com.project.maltbackend.model.Order;
import com.project.maltbackend.response.PaymentResponse;
import com.stripe.exception.StripeException;

public interface PaymentService {
    public PaymentResponse createPaymentLink(Order order) throws StripeException;
}
