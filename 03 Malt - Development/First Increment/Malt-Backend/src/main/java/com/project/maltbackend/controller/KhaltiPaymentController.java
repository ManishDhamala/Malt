package com.project.maltbackend.controller;

import com.project.maltbackend.model.*;
import com.project.maltbackend.repository.OrderRepository;
import com.project.maltbackend.repository.PaymentRepository;
import com.project.maltbackend.service.KhaltiService;
import com.project.maltbackend.service.OrderServiceImp;
import com.project.maltbackend.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment/khalti")
public class KhaltiPaymentController {

    @Autowired
    private KhaltiService khaltiService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderServiceImp orderServiceImp;

    @Autowired
    private UserService userService;


    private final int deliveryCharge = 100;
    private final int restaurantCharge = 10;

    @Transactional
    @PostMapping("/verify")
    public ResponseEntity<?> verifyKhalti(@RequestBody Map<String, String> payload,
                                          @RequestHeader("Authorization") String jwt) throws Exception {
        String pidx = payload.get("pidx");
        System.out.println("✅ Verifying Khalti payment for pidx: " + pidx);

        User user = userService.findUserByJwtToken(jwt);
        Map<String, Object> verification = khaltiService.verifyKhaltiPayment(pidx);

        System.out.println("✅ Khalti verification response: " + verification);

        if (!"Completed".equals(verification.get("status"))) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Payment not completed"));
        }

        // Find payment by pidx (transactionId)
        Payment payment = paymentRepository.findByTransactionId(pidx);
        if (payment == null) {
            // If not found by transactionId (may not be saved yet), find the one with matching status and unpaid
            payment = paymentRepository.findFirstByPaidFalseOrderByIdDesc(); // Optional fallback
            if (payment == null) {
                System.err.println(" No payment found matching pidx: " + pidx);
                return ResponseEntity.status(404).body(Map.of("success", false, "message", "Related payment not found"));
            }
        }

        Order order = payment.getOrder();
        if (order == null) {
            throw new Exception("Order not found for the payment");
        }

        // Updating payment
        payment.setStatus("PAID");
        payment.setPaid(true);
        payment.setTransactionId(pidx);
        payment.setPaidAt(new Date());
        paymentRepository.save(payment);


        // Updating order (and sending email)
        orderServiceImp.updateOrder(order.getId(), "CONFIRMED");


        return ResponseEntity.ok(Map.of("success", true, "orderId", order.getId()));
    }


}
