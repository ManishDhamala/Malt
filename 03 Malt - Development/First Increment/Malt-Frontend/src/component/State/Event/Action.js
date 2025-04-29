import { api } from '../../config/api';
import {
    CREATE_EVENT_REQUEST, CREATE_EVENT_SUCCESS, CREATE_EVENT_FAILURE,
    UPDATE_EVENT_REQUEST, UPDATE_EVENT_SUCCESS, UPDATE_EVENT_FAILURE,
    DELETE_EVENT_REQUEST, DELETE_EVENT_SUCCESS, DELETE_EVENT_FAILURE,
    GET_ALL_EVENTS_REQUEST, GET_ALL_EVENTS_SUCCESS, GET_ALL_EVENTS_FAILURE,
    GET_RESTAURANT_EVENTS_REQUEST, GET_RESTAURANT_EVENTS_SUCCESS, GET_RESTAURANT_EVENTS_FAILURE,
    GET_EVENT_BY_ID_REQUEST, GET_EVENT_BY_ID_SUCCESS, GET_EVENT_BY_ID_FAILURE
} from './ActionType';


// Create Event
export const createEvent = ({ data, jwt }) => async (dispatch) => {
    dispatch({ type: CREATE_EVENT_REQUEST });
    try {
        const response = await api.post('/api/admin/events', data, {
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: CREATE_EVENT_SUCCESS, payload: response.data });
        console.log("Event Created: ", response.data)
        return response.data;
    } catch (error) {
        dispatch({ type: CREATE_EVENT_FAILURE, payload: error.message });
        throw error;
    }
};

// Update Event
export const updateEvent = ({ eventId, data, jwt }) => async (dispatch) => {
    dispatch({ type: UPDATE_EVENT_REQUEST });
    try {
        const response = await api.put(`/api/admin/events/${eventId}`, data, {
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: UPDATE_EVENT_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        dispatch({ type: UPDATE_EVENT_FAILURE, payload: error.message });
        throw error;
    }
};

// Delete Event
export const deleteEvent = ({ eventId, jwt }) => async (dispatch) => {
    dispatch({ type: DELETE_EVENT_REQUEST });
    try {
        const response = await api.delete(`/api/admin/events/${eventId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        dispatch({ type: DELETE_EVENT_SUCCESS, payload: eventId });
        return response.data;
    } catch (error) {
        dispatch({ type: DELETE_EVENT_FAILURE, payload: error.message });
        throw error;
    }
};

// Get All Events
export const getAllEvents = () => async (dispatch) => {
    dispatch({ type: GET_ALL_EVENTS_REQUEST });
    try {
        const response = await api.get('/api/events');
        dispatch({ type: GET_ALL_EVENTS_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        dispatch({ type: GET_ALL_EVENTS_FAILURE, payload: error.message });
        throw error;
    }
};

// Get Restaurant Events
export const getRestaurantEvents = (jwt) => async (dispatch) => {
    dispatch({ type: GET_RESTAURANT_EVENTS_REQUEST });
    try {
        const response = await api.get('/api/admin/events/restaurant', {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        dispatch({ type: GET_RESTAURANT_EVENTS_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        dispatch({ type: GET_RESTAURANT_EVENTS_FAILURE, payload: error.message });
        throw error;
    }
};

// Get Event By ID
export const getEventById = ({ eventId, jwt }) => async (dispatch) => {
    dispatch({ type: GET_EVENT_BY_ID_REQUEST });
    try {
        const response = await api.get(`/api/events/${eventId}`);
        dispatch({ type: GET_EVENT_BY_ID_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        dispatch({ type: GET_EVENT_BY_ID_FAILURE, payload: error.message });
        throw error;
    }
};