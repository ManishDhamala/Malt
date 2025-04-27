package com.project.maltbackend.controller;

import com.project.maltbackend.model.*;
import com.project.maltbackend.repository.OrderRepository;
import com.project.maltbackend.repository.PaymentRepository;
import com.project.maltbackend.service.OrderService;
import com.project.maltbackend.service.OrderServiceImp;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/webhook")
public class StripeWebhookController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderServiceImp orderServiceImp;

    private final int deliveryCharge = 100;
    private final int restaurantCharge = 10;

    @Value("${stripe.webhookKey}")
    private String webhookKey;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,
                                                      @RequestHeader("Stripe-Signature") String sigHeader) {
        String endpointSecret = webhookKey;

        try {
            Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);

            if ("checkout.session.completed".equals(event.getType())) {
                Session session = (Session) event.getDataObjectDeserializer()
                        .getObject()
                        .orElse(null);

                if (session != null) {
                    Long orderId = extractOrderIdFromSuccessUrl(session.getSuccessUrl());
                    Order order = orderRepository.findById(orderId).orElse(null);

                    if (order != null) {
                        Payment payment = paymentRepository.findByOrder(order);
                        payment.setStatus("PAID");
                        payment.setPaid(true);
                        payment.setTransactionId(session.getId());
                        payment.setPaidAt(new Date());
                        paymentRepository.save(payment);

                        //order.setOrderStatus("CONFIRMED");
                        orderService.updateOrder(order.getId(), "CONFIRMED");
                        orderRepository.save(order);


                        User user = order.getCustomer();
                        Address address = order.getDeliveryAddress();
                        Restaurant restaurant = order.getRestaurant();
                        List<OrderItem> items = order.getItems();
                        Long subtotal = order.getTotalPrice() - deliveryCharge - restaurantCharge;

                        // Extracting email sending method from order service implementation
                        orderServiceImp.sendOrderConfirmationEmail(user, order, address, restaurant, items, subtotal);

                    }
                }
            }

            return ResponseEntity.ok("Webhook received");

        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid signature: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Webhook processing error: " + e.getMessage());
        }
    }

    // Utility method: extract order ID from success URL
    private Long extractOrderIdFromSuccessUrl(String successUrl) {
        // Example: http://localhost:5173/payment/success/123
        String[] parts = successUrl.split("/payment/success/");
        return Long.parseLong(parts[1]);
    }


}
