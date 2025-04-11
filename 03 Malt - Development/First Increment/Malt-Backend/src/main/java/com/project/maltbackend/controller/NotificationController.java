package com.project.maltbackend.controller;

import com.project.maltbackend.model.Notification;
import com.project.maltbackend.model.User;
import com.project.maltbackend.service.NotificationService;
import com.project.maltbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Notification> notifications = notificationService.getUserNotifications(user.getId());
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);

        List<Notification> notifications = notificationService.getUnreadNotifications(user.getId());
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    @GetMapping("/count/unread")
    public ResponseEntity<Map<String, Long>> getUnreadNotificationCount(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Long count = notificationService.getUnreadNotificationCount(user.getId());
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markNotificationAsRead(
            @PathVariable Long notificationId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Notification notification = notificationService.markNotificationAsRead(notificationId);
        return new ResponseEntity<>(notification, HttpStatus.OK);
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllNotificationsAsRead(@RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        notificationService.markAllNotificationsAsRead(user.getId());

        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @PathVariable Long notificationId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        notificationService.deleteNotification(notificationId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification deleted successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
