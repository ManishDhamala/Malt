package com.project.maltbackend.controller;

import com.project.maltbackend.model.CartItem;
import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.User;
import com.project.maltbackend.request.OrderRequest;
import com.project.maltbackend.service.OrderService;
import com.project.maltbackend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PostMapping("/order")
    public ResponseEntity<Order> createOrder( @Valid @RequestBody OrderRequest request,
                                                @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.createOrder(request,user);

        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping("/order/user")
    public ResponseEntity<List<Order>> getOrderHistory(@RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        List<Order> orders = orderService.getUsersOrders(user.getId());

        return new ResponseEntity<>(orders, HttpStatus.OK);
    }



}
