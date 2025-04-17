import {
    CREATE_EVENT_REQUEST, CREATE_EVENT_SUCCESS, CREATE_EVENT_FAILURE,
    UPDATE_EVENT_REQUEST, UPDATE_EVENT_SUCCESS, UPDATE_EVENT_FAILURE,
    DELETE_EVENT_REQUEST, DELETE_EVENT_SUCCESS, DELETE_EVENT_FAILURE,
    GET_ALL_EVENTS_REQUEST, GET_ALL_EVENTS_SUCCESS, GET_ALL_EVENTS_FAILURE,
    GET_RESTAURANT_EVENTS_REQUEST, GET_RESTAURANT_EVENTS_SUCCESS, GET_RESTAURANT_EVENTS_FAILURE,
    GET_EVENT_BY_ID_REQUEST, GET_EVENT_BY_ID_SUCCESS, GET_EVENT_BY_ID_FAILURE,
    RESET_CURRENT_EVENT
} from './ActionType';

const initialState = {
    allEvents: [],             // for customer/public view
    restaurantEvents: [],      // for admin/restaurant owner
    currentEvent: null,
    loading: false,
    error: null,
};

export const eventReducer = (state = initialState, action) => {
    switch (action.type) {

        // Create Event
        case CREATE_EVENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case CREATE_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurantEvents: [...state.restaurantEvents, action.payload],
            };
        case CREATE_EVENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Update Event
        case UPDATE_EVENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case UPDATE_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurantEvents: state.restaurantEvents.map((event) =>
                    event.id === action.payload.id ? action.payload : event
                ),
                currentEvent: action.payload,
            };
        case UPDATE_EVENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Delete Event
        case DELETE_EVENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case DELETE_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurantEvents: state.restaurantEvents.filter((event) => event.id !== action.payload),
                currentEvent: state.currentEvent?.id === action.payload ? null : state.currentEvent,
            };
        case DELETE_EVENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get All Events (Customer side)
        case GET_ALL_EVENTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_ALL_EVENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                allEvents: action.payload,
            };
        case GET_ALL_EVENTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Restaurant Events (Admin side)
        case GET_RESTAURANT_EVENTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_RESTAURANT_EVENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurantEvents: action.payload,
            };
        case GET_RESTAURANT_EVENTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Get Event By ID
        case GET_EVENT_BY_ID_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_EVENT_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                currentEvent: action.payload,
            };
        case GET_EVENT_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Reset Current Event 
        case RESET_CURRENT_EVENT:
            return {
                ...state,
                currentEvent: null,
            };

        default:
            return state;
    }
};
