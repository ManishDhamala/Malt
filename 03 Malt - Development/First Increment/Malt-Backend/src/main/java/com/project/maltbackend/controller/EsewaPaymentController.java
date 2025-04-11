package com.project.maltbackend.controller;

import com.project.maltbackend.dto.EsewaSuccessPayload;
import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.Payment;
import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.OrderRepository;
import com.project.maltbackend.repository.PaymentRepository;
import com.project.maltbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment/esewa")
public class EsewaPaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/verify")
    public ResponseEntity<String> verifyEsewaPayment(@RequestBody EsewaSuccessPayload payload) {
        try {
            System.out.println("Verifying Esewa Payment:");
            System.out.println("Transaction UUID: " + payload.getTransaction_uuid());

            if (payload.getTransaction_uuid() == null) {
                return ResponseEntity.badRequest().body("Missing transaction UUID");
            }

            String transactionUuid = payload.getTransaction_uuid(); // e.g., ORD-4852
            Long orderId;

            try {
                orderId = Long.valueOf(transactionUuid.replace("ORD-", ""));
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Invalid transaction UUID format");
            }

            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }

            Order order = orderOpt.get();
            String totalAmount = String.valueOf(order.getTotalPrice().intValue()); // e.g., 100

            // Verify payment with eSewa
            String verificationUrl = String.format(
                    "https://rc.esewa.com.np/api/epay/transaction/status/?product_code=EPAYTEST&total_amount=%s&transaction_uuid=%s",
                    totalAmount,
                    transactionUuid
            );

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.getForEntity(verificationUrl, Map.class);

            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not verify payment from eSewa");
            }

            Map<String, Object> esewaData = response.getBody();
            System.out.println("eSewa Response: " + esewaData);

            if (!"COMPLETE".equalsIgnoreCase((String) esewaData.get("status"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment status not complete");
            }

            String refId = (String) esewaData.get("ref_id");

            // Save payment info
            Payment payment = paymentRepository.findByOrder(order);
            if (payment == null) {
                payment = new Payment();
                payment.setOrder(order);
                payment.setPaymentMethod("ESEWA");
            }

            payment.setTransactionId(refId);
            payment.setStatus("PAID");
            payment.setPaid(true);
            payment.setPaidAt(new Date());
            paymentRepository.save(payment);

            order.setOrderStatus("PAID");
            orderRepository.save(order);

            return ResponseEntity.ok("eSewa payment verified and saved successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Payment verification failed: " + e.getMessage());
        }
    }


    private Long extractOrderId(String transactionUuid) {
        try {
            // Handle possible non-numeric characters after ORD- prefix
            String idPart = transactionUuid.replace("ORD-", "");
            return Long.valueOf(idPart);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid transaction UUID format: " + transactionUuid);
        }
    }
}

