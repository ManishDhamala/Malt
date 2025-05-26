package com.project.maltbackend.controller;

import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.Payment;
import com.project.maltbackend.repository.OrderRepository;
import com.project.maltbackend.repository.PaymentRepository;
import com.project.maltbackend.service.EsewaService;
import com.project.maltbackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class EsewaPaymentController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EsewaService esewaService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderWebSocketController orderWebSocketController;

    @Transactional
    @PostMapping("/esewa/verify")
    public ResponseEntity<?> verifyEsewaPayment(@RequestBody Map<String, String> payload) {
        try {
            String orderId = payload.get("orderId");
            String referenceId = payload.get("refId");
            String signature = payload.get("signature");

            if (orderId == null || signature == null) {
                return ResponseEntity.badRequest().body("Missing required parameters");
            }

            Order order = orderRepository.findById(Long.parseLong(orderId))
                    .orElseThrow(() -> new Exception("Order not found"));

            // Verify payment with E-sewa
            boolean isVerified = esewaService.verifyPayment(signature, order.getTotalPrice().toString());

            if (isVerified) {
                // Update payment status
                Payment payment = order.getPayment();
                payment.setStatus("PAID");
                payment.setPaid(true);
                payment.setTransactionId(signature);
                payment.setPaidAt(new Date());
                paymentRepository.save(payment);

                // Update order status
                orderService.updateOrder(order.getId(), "CONFIRMED");

                // Updating order status in real time
                try {
                    orderWebSocketController.notifyOrderStatusUpdate(
                            order.getRestaurant().getId(),
                            order.getId(),
                            "CONFIRMED"
                    );
                } catch (Exception e) {
                    System.err.println("WebSocket Order status update failed: " + e.getMessage());
                }

                orderRepository.save(order);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Payment verified successfully");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Payment verification failed");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}

