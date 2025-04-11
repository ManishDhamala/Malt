import { api } from "../../config/api";
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

// Get all notifications
export const getAllNotifications = (jwt) => async (dispatch) => {
    dispatch({ type: GET_NOTIFICATIONS_REQUEST });
    try {
        const { data } = await api.get(`/api/notifications`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        dispatch({ type: GET_NOTIFICATIONS_SUCCESS, payload: data });
        console.log("All notifications fetched", data);
        return { success: true, data };

    } catch (error) {
        dispatch({ type: GET_NOTIFICATIONS_FAIL, payload: error });
        console.log("error", error);
        return { error: error.response?.data?.message || "Failed to fetch notifications" };
    }
};

// Get unread notifications
export const getUnreadNotifications = (jwt) => async (dispatch) => {
    dispatch({ type: GET_UNREAD_NOTIFICATIONS_REQUEST });
    try {
        const { data } = await api.get(`/api/notifications/unread`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        dispatch({ type: GET_UNREAD_NOTIFICATIONS_SUCCESS, payload: data });
        console.log("Unread notifications fetched", data);
        return { success: true, data };

    } catch (error) {
        dispatch({ type: GET_UNREAD_NOTIFICATIONS_FAIL, payload: error });
        console.log("error", error);
        return { error: error.response?.data?.message || "Failed to fetch unread notifications" };
    }
};

// Get unread notification count
export const getUnreadNotificationCount = (jwt) => async (dispatch) => {
    dispatch({ type: GET_NOTIFICATION_COUNT_REQUEST });
    try {
        const { data } = await api.get(`/api/notifications/count/unread`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        dispatch({ type: GET_NOTIFICATION_COUNT_SUCCESS, payload: data });
        console.log("Unread notification count", data);
        return { success: true, data };

    } catch (error) {
        dispatch({ type: GET_NOTIFICATION_COUNT_FAIL, payload: error });
        console.log("error", error);
        return { error: error.response?.data?.message || "Failed to fetch notification count" };
    }
};

// Mark a notification as read
export const markNotificationAsRead = ({ jwt, notificationId }) => async (dispatch) => {
    dispatch({ type: MARK_NOTIFICATION_READ_REQUEST });
    try {
        const { data } = await api.patch(`/api/notifications/${notificationId}/read`, {}, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        dispatch({ type: MARK_NOTIFICATION_READ_SUCCESS, payload: { id: notificationId, data } });
        console.log("Notification marked as read", data);
        return { success: true, data };

    } catch (error) {
        dispatch({ type: MARK_NOTIFICATION_READ_FAIL, payload: error });
        console.log("error", error);
        return { error: error.response?.data?.message || "Failed to mark notification as read" };
    }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = (jwt) => async (dispatch) => {
    dispatch({ type: MARK_ALL_NOTIFICATIONS_READ_REQUEST });
    try {
        const { data } = await api.patch(`/api/notifications/read-all`, {}, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        dispatch({ type: MARK_ALL_NOTIFICATIONS_READ_SUCCESS, payload: data });
        console.log("All notifications marked as read", data);
        return { success: true, data };

    } catch (error) {
        dispatch({ type: MARK_ALL_NOTIFICATIONS_READ_FAIL, payload: error });
        console.log("error", error);
        return { error: error.response?.data?.message || "Failed to mark all notifications as read" };
    }
};

// Delete a notification
export const deleteNotification = ({ jwt, notificationId }) => async (dispatch) => {
    dispatch({ type: DELETE_NOTIFICATION_REQUEST });
    try {
        const { data } = await api.delete(`/api/notifications/${notificationId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        dispatch({ type: DELETE_NOTIFICATION_SUCCESS, payload: { id: notificationId, data } });
        console.log("Notification deleted", data);
        return { success: true, data };

    } catch (error) {
        dispatch({ type: DELETE_NOTIFICATION_FAIL, payload: error });
        console.log("error", error);
        return { error: error.response?.data?.message || "Failed to delete notification" };
    }
};

// Reset notification state (used on logout)
export const resetNotificationState = () => (dispatch) => {
    dispatch({ type: RESET_NOTIFICATION_STATE });
};