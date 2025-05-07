package com.project.maltbackend.controller;

import com.project.maltbackend.dto.OrderDto;
import com.project.maltbackend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
public class OrderWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    public OrderWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyNewOrder(Long restaurantId, OrderDto order) {
        messagingTemplate.convertAndSend("/topic/orders/" + restaurantId, order);
    }

    public void notifyOrderStatusUpdate(Long restaurantId, Long orderId, String newStatus) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("orderId", orderId);
        payload.put("newStatus", newStatus);
        messagingTemplate.convertAndSend("/topic/orders/" + restaurantId + "/status", payload);
    }


}