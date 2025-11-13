package com.project.maltbackend.service;


import com.project.maltbackend.controller.NotificationWebSocketController;
import com.project.maltbackend.model.Notification;
import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationServiceImp implements NotificationService {

    private final NotificationRepository notificationRepository;

    private final NotificationWebSocketController notificationWebSocketController;

    @Override
    public Notification createWelcomeNotification(User user) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle("Welcome to Malt!");
        notification.setContent("Thank you for registering with us. Start exploring restaurants and delicious food options!");
        notification.setType("USER_WELCOME");

        log.info("Created welcome notification for user: {}", user.getEmail());
        return notificationRepository.save(notification);
    }

    @Override
    public Notification createOrderNotification(User user, Order order) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle("Order Placed Successfully");
        notification.setContent("Your order #" + order.getId() + " from " + order.getRestaurant().getName() +
                " has been placed successfully. Current status: " + order.getOrderStatus());
        notification.setType("ORDER_CREATED");
        notification.setReferenceId(order.getId());
        notification = notificationRepository.save(notification);

        // Real time update of notification
        try {
            notificationWebSocketController.sendNotificationToUser(user.getId(), notification);
        } catch (Exception e) {
            System.out.println("Websocket notification failed: "+e.getMessage());
        }

        log.info("Created order notification for user: {}, orderId: {}", user.getEmail(), order.getId());
        return notification;
    }

    @Override
    public Notification createOrderStatusNotification(User user, Order order, String previousStatus) {
        String title = "Order Status Updated";
        String content;

        switch (order.getOrderStatus()) {
            case "CONFIRMED":
                title = "Order Confirmed";
                content = "Good news! Your order #" + order.getId() + " from " + order.getRestaurant().getName() +
                        " has been confirmed and is being prepared.";
                break;
            case "OUT_FOR_DELIVERY":
                title = "Order Out For Delivery";
                content = "Your order #" + order.getId() + " is on the way! It will arrive at your location shortly.";
                break;
            case "DELIVERED":
                title = "Order Delivered";
                content = "Your order #" + order.getId() + " has been delivered. Enjoy your meal!";
                break;
            default:
                content = "Your order #" + order.getId() + " status has been updated from " + previousStatus +
                        " to " + order.getOrderStatus();
        }

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setType("ORDER_STATUS_UPDATE");
        notification.setReferenceId(order.getId());

        notification = notificationRepository.save(notification);

        // Real time update of notification
        try {
            notificationWebSocketController.sendNotificationToUser(user.getId(), notification);
        } catch (Exception e) {
            System.out.println("Websocket notification failed: "+e.getMessage());
        }

        log.info("Created order status notification for user: {}, orderId: {}, status: {}",
                user.getEmail(), order.getId(), order.getOrderStatus());
        return notification;
    }

    @Override
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
    }

    @Override
    public Long getUnreadNotificationCount(Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    @Override
    public Notification markNotificationAsRead(Long notificationId) throws Exception {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new Exception("Notification not found"));

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public void markAllNotificationsAsRead(Long userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    @Override
    public void deleteNotification(Long notificationId) throws Exception {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new Exception("Notification not found"));

        notificationRepository.delete(notification);
    }
}
