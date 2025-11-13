package com.project.maltbackend.controller;

import com.project.maltbackend.dto.OrderDto;
import com.project.maltbackend.dto.PaginatedResponse;
import com.project.maltbackend.model.User;
import com.project.maltbackend.service.OrderService;
import com.project.maltbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminOrderController {

    private final OrderService orderService;

    private final UserService userService;


    @GetMapping("/order/restaurant/{id}")
    public ResponseEntity<PaginatedResponse<OrderDto>> getOrderHistory(@PathVariable Long id, @RequestParam(required = false) String order_status, @RequestParam(required = false) Integer year, @RequestParam(required = false) Integer month, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        PaginatedResponse<OrderDto> response = orderService.getRestaurantsOrders(id, order_status, year, month, page, size);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/order/{id}/{orderStatus}")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long id, @PathVariable String orderStatus, @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        OrderDto orderDto = orderService.updateOrder(id, orderStatus);

        return new ResponseEntity<>(orderDto, HttpStatus.OK);
    }


}
