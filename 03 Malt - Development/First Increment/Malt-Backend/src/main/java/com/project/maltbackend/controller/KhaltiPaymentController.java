package com.project.maltbackend.controller;

import com.project.maltbackend.model.*;
import com.project.maltbackend.repository.OrderRepository;
import com.project.maltbackend.repository.PaymentRepository;
import com.project.maltbackend.service.KhaltiService;
import com.project.maltbackend.service.OrderService;
import com.project.maltbackend.service.OrderServiceImp;
import com.project.maltbackend.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/payment/khalti")
public class KhaltiPaymentController {

    private final KhaltiService khaltiService;

    private final PaymentRepository paymentRepository;

    private final OrderRepository orderRepository;

    private final OrderService orderService;

    private final OrderWebSocketController orderWebSocketController;

    private final UserService userService;

    @Transactional
    @PostMapping("/verify")
    public ResponseEntity<?> verifyKhalti(@RequestBody Map<String, String> payload,
                                          @RequestHeader("Authorization") String jwt) {
        try {
            String pidx = payload.get("pidx");
            User user = userService.findUserByJwtToken(jwt);

            Map<String, Object> verification = khaltiService.verifyKhaltiPayment(pidx);
            System.out.println("Khalti verification response: " + verification);

            // Check if status is "Completed"
            String status = (String) verification.get("status");
            Map<String, Object> state = (Map<String, Object>) verification.get("state");
            String stateName = state != null ? (String) state.get("name") : null;

            if (!"Completed".equalsIgnoreCase(status) && !"Completed".equalsIgnoreCase(stateName)) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Payment not completed"));
            }

            // Proceed with payment update if completed
            Payment payment = paymentRepository.findByTransactionId(pidx);
            if (payment == null) {
                payment = paymentRepository.findFirstByPaidFalseOrderByIdDesc();
                if (payment == null) {
                    return ResponseEntity.ok(Map.of("success", false, "message", "Payment not found"));
                }
            }

            Order order = payment.getOrder();
            if (order == null) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Order not found"));
            }

            payment.setStatus("PAID");
            payment.setPaid(true);
            payment.setTransactionId(pidx);
            payment.setPaidAt(new Date());
            paymentRepository.save(payment);

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

            return ResponseEntity.ok(Map.of("success", true, "orderId", order.getId()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("success", false, "message", "Server error: " + e.getMessage()));
        }
    }


}
