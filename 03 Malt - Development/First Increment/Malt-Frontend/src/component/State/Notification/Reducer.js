import {
    GET_NOTIFICATIONS_REQUEST,
    GET_NOTIFICATIONS_SUCCESS,
    GET_NOTIFICATIONS_FAIL,
    GET_UNREAD_NOTIFICATIONS_REQUEST,
    GET_UNREAD_NOTIFICATIONS_SUCCESS,
    GET_UNREAD_NOTIFICATIONS_FAIL,
    GET_NOTIFICATION_COUNT_REQUEST,
    GET_NOTIFICATION_COUNT_SUCCESS,
    GET_NOTIFICATION_COUNT_FAIL,
    MARK_NOTIFICATION_READ_REQUEST,
    MARK_NOTIFICATION_READ_SUCCESS,
    MARK_NOTIFICATION_READ_FAIL,
    MARK_ALL_NOTIFICATIONS_READ_REQUEST,
    MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
    MARK_ALL_NOTIFICATIONS_READ_FAIL,
    DELETE_NOTIFICATION_REQUEST,
    DELETE_NOTIFICATION_SUCCESS,
    DELETE_NOTIFICATION_FAIL,
    RESET_NOTIFICATION_STATE
} from "./ActionType";

const initialState = {
    notifications: [],
    unreadNotifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    success: null
};

export const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_NOTIFICATIONS_REQUEST:
        case GET_UNREAD_NOTIFICATIONS_REQUEST:
        case GET_NOTIFICATION_COUNT_REQUEST:
        case MARK_NOTIFICATION_READ_REQUEST:
        case MARK_ALL_NOTIFICATIONS_READ_REQUEST:
        case DELETE_NOTIFICATION_REQUEST:
            return { ...state, isLoading: true, error: null, success: null };

        case GET_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                notifications: action.payload,
                success: "Notifications fetched successfully"
            };

        case GET_UNREAD_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                unreadNotifications: action.payload,
                success: "Unread notifications fetched successfully"
            };

        case GET_NOTIFICATION_COUNT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                unreadCount: action.payload.count,
                success: "Notification count fetched successfully"
            };

        case MARK_NOTIFICATION_READ_SUCCESS:
            return {
                ...state,
                isLoading: false,
                notifications: state.notifications.map(notification =>
                    notification.id === action.payload.id
                        ? { ...notification, isRead: true }
                        : notification
                ),
                unreadNotifications: state.unreadNotifications.filter(
                    notification => notification.id !== action.payload.id
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
                success: "Notification marked as read"
            };

        case MARK_ALL_NOTIFICATIONS_READ_SUCCESS:
            return {
                ...state,
                isLoading: false,
                notifications: state.notifications.map(notification => ({
                    ...notification,
                    isRead: true
                })),
                unreadNotifications: [],
                unreadCount: 0,
                success: "All notifications marked as read"
            };

        case DELETE_NOTIFICATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                notifications: state.notifications.filter(
                    notification => notification.id !== action.payload.id
                ),
                unreadNotifications: state.unreadNotifications.filter(
                    notification => notification.id !== action.payload.id
                ),
                unreadCount: state.unreadCount - (
                    state.unreadNotifications.some(n => n.id === action.payload.id) ? 1 : 0
                ),
                success: "Notification deleted successfully"
            };

        case RESET_NOTIFICATION_STATE:
            return initialState;

        case GET_NOTIFICATIONS_FAIL:
        case GET_UNREAD_NOTIFICATIONS_FAIL:
        case GET_NOTIFICATION_COUNT_FAIL:
        case MARK_NOTIFICATION_READ_FAIL:
        case MARK_ALL_NOTIFICATIONS_READ_FAIL:
        case DELETE_NOTIFICATION_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                success: null
            };

        default:
            return state;
    }
};