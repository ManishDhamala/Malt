import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connectToOrderUpdates = (restaurantId, onNewOrder, onStatusUpdate) => {
    if (stompClient && stompClient.connected) {
        stompClient.deactivate();
    }

    stompClient = new Client({
        brokerURL: 'ws://localhost:8080/ws', // native WebSocket
        reconnectDelay: 5000,
        debug: (str) => console.log(str),
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
        console.log('Connected:', frame);
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

        stompClient.onConnect = () => {
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
        stompClient.deactivate();
        stompClient = null;
    }
};