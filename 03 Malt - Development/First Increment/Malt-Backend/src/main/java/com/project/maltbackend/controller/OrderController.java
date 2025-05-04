package com.project.maltbackend.controller;

import com.project.maltbackend.dto.OrderDto;
import com.project.maltbackend.model.CartItem;
import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.Payment;
import com.project.maltbackend.model.User;
import com.project.maltbackend.request.OrderRequest;
import com.project.maltbackend.response.PaymentResponse;
import com.project.maltbackend.service.OrderService;
import com.project.maltbackend.service.PaymentService;
import com.project.maltbackend.service.UserService;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import jakarta.validation.Valid;
import jdk.jfr.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;


    @PostMapping("/order")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest request,
                                         @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Object response = orderService.createOrder(request, user);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/order/user")
    public ResponseEntity<List<OrderDto>> getOrderHistory(@RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        List<OrderDto> orders = orderService.getUsersOrders(user.getId());

        return new ResponseEntity<>(orders, HttpStatus.OK);
    }


}
