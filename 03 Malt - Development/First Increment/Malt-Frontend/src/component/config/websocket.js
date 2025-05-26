import { Client } from '@stomp/stompjs';

// Global variable to store the active STOMP client instance
let stompClient = null;

export const connectToOrderUpdates = (restaurantId, onNewOrder, onStatusUpdate) => {

    // Checking existing connection (already connected)
    if (stompClient && stompClient.connected) {
        stompClient.deactivate();
    }

    stompClient = new Client({
        brokerURL: 'ws://localhost:8080/ws', // Websocket URL to connect to the server
        reconnectDelay: 5000,       // try to connect in every 5 seconds
        debug: (str) => console.log(str),  // Debug messages in console
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    // Callback when connection is successfully established
    stompClient.onConnect = (frame) => {
        console.log('Connected:', frame);

        // Subscribe to the topic for receiving new orders
        stompClient.subscribe(`/topic/orders/${restaurantId}`, (message) => {
            onNewOrder(JSON.parse(message.body));
        });

        // Subscribe to order status updates
        stompClient.subscribe(`/topic/orders/${restaurantId}/status`, (message) => {
            onStatusUpdate(JSON.parse(message.body));
        });

    };

    stompClient.activate();
};


export const connectToNotifications = (userId, onNotification) => {
    // Only create new client if none exists
    if (!stompClient) {
        stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        // Callback when connection is successfully established
        stompClient.onConnect = () => {
            // Subscribe to topic for receiving notifications
            stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
                const notification = JSON.parse(message.body);
                onNotification(notification);
            });
        };

        stompClient.activate();
    }
    return stompClient;
};


export const disconnect = () => {
    if (stompClient) {
        stompClient.deactivate();  // Closing the connection
        stompClient = null;         // Clearing the client instance
    }
};