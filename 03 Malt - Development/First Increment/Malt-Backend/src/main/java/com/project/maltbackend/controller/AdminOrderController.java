package com.project.maltbackend.controller;

import com.project.maltbackend.dto.OrderDto;
import com.project.maltbackend.dto.PaginatedResponse;
import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.User;
import com.project.maltbackend.service.OrderService;
import com.project.maltbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminOrderController {


    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;


//    @GetMapping("/order/restaurant/{id}")
//    public ResponseEntity<List<OrderDto>> getOrderHistory(@PathVariable Long id,
//                                                       @RequestParam(required = false) String order_status,
//                                                       @RequestHeader("Authorization") String jwt) throws Exception {
//
//        User user = userService.findUserByJwtToken(jwt);
//        List<OrderDto> orders = orderService.getRestaurantsOrders(id,order_status);
//
//        return new ResponseEntity<>(orders, HttpStatus.OK);
//    }


    @GetMapping("/order/restaurant/{id}")
    public ResponseEntity<PaginatedResponse<OrderDto>> getOrderHistory(
            @PathVariable Long id,
            @RequestParam(required = false) String order_status,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        PaginatedResponse<OrderDto> response = orderService.getRestaurantsOrders(
                id, order_status, year, month, page, size);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/order/{id}/{orderStatus}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id,
                                                       @PathVariable String orderStatus,
                                                       @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.updateOrder(id,orderStatus);

        return new ResponseEntity<>(order, HttpStatus.OK);
    }



}
