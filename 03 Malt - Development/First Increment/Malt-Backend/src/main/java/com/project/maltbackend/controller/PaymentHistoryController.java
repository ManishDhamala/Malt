package com.project.maltbackend.controller;

import com.project.maltbackend.dto.PaymentDto;
import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.User;
import com.project.maltbackend.service.PaymentHistoryService;
import com.project.maltbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

    @RestController
    @RequiredArgsConstructor
    @RequestMapping("/api/payments")
    public class PaymentHistoryController {

        private final PaymentHistoryService paymentHistoryService;
        private final UserService userService;

        @GetMapping("/history")
        public ResponseEntity<List<PaymentDto>> getPaymentHistory(@RequestHeader("Authorization") String jwt) throws Exception {
            User currentUser = userService.findUserByJwtToken(jwt);
            List<PaymentDto> paidPayments = paymentHistoryService.getPaidPaymentsByUser(currentUser);
            return ResponseEntity.ok(paidPayments);
        }

        @PostMapping("/save")
        public ResponseEntity<PaymentDto> savePayment(@RequestBody PaymentDto paymentDto, @RequestParam Long orderId) {
            Order order = new Order();
            order.setId(orderId);

            PaymentDto savedPayment = paymentHistoryService.savePayment(paymentDto, order);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPayment);
        }
    }


