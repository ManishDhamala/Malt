package com.project.maltbackend.service;

import com.project.maltbackend.model.Notification;
import com.project.maltbackend.model.Order;
import com.project.maltbackend.model.User;

import java.util.List;

public interface NotificationService {
    // Create notifications for different events
    Notification createWelcomeNotification(User user);
    Notification createOrderNotification(User user, Order order);
    Notification createOrderStatusNotification(User user, Order order, String previousStatus);

    // Get notifications
    List<Notification> getUserNotifications(Long userId);
    List<Notification> getUnreadNotifications(Long userId);
    Long getUnreadNotificationCount(Long userId);

    // Mark notifications as read
    Notification markNotificationAsRead(Long notificationId) throws Exception;
    void markAllNotificationsAsRead(Long userId);

    // Delete notification
    void deleteNotification(Long notificationId) throws Exception;
}