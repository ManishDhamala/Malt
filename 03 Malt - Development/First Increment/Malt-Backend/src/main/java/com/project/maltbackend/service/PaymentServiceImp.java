package com.project.maltbackend.service;

import com.project.maltbackend.model.Order;
import com.project.maltbackend.response.PaymentResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImp implements PaymentService {

    @Value("${stripe.secretKey}")
    private String secretKey;

    @Override
    public PaymentResponse createPaymentLink(Order order) throws StripeException {

        Stripe.apiKey = secretKey;
        SessionCreateParams params = SessionCreateParams.builder().addPaymentMethodType(
                SessionCreateParams.
                        PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/payment/success/"+order.getId())
                .setCancelUrl("http://localhost:5173/payment/fail")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L).setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("NPR")   // Setting the currency (Stripe works with the smallest currency unit (like cents for USD or paisa for NPR))
                                .setUnitAmount((long)order.getTotalPrice()*100)  // Multiplying it by 100 to convert into Nepalese Rupees(NPR) [2 * 100 paisa = 2NPR]
                                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName("Malt")
                                                        .build())
                                                .build()
                                )
                                .build()
                        )
                .build();

        Session session = Session.create(params);

        PaymentResponse response = new PaymentResponse();
        response.setPayment_url(session.getUrl());

        return response;
    }
}
