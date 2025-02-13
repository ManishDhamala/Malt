import * as actionTypes from './ActionType';

const initialState = {
    restaurantOrders: [],   // List of all restaurant orders
    loading: false,         // Loading state for API requests
    error: null,            // Holds any error messages
    message: null           // Success messages
};


const restaurantOrderReducer = (state = initialState, action) => {
    switch (action.type) {

        //  REQUEST CASES (Start Loading)
        case actionTypes.GET_RESTAURANT_ORDER_REQUEST:
        case actionTypes.UPDATE_ORDER_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        //  SUCCESS CASES

        // Get All Restaurant Orders
        case actionTypes.GET_RESTAURANT_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurantOrders: action.payload // Load all restaurant orders
            };

        // Update Order Status
        case actionTypes.UPDATE_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurantOrders: state.restaurantOrders.map(order =>
                    order.id === action.payload.id
                        ? { ...order, status: action.payload.status } // Update order status
                        : order
                ),
                message: "Order status updated successfully!" // Success message
            };

        //  FAIL CASES (Handle Errors)
        case actionTypes.GET_RESTAURANT_ORDER_FAIL:
        case actionTypes.UPDATE_ORDER_STATUS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,  // Set error message
                message: null
            };

        //  DEFAULT CASE (Return Current State)
        default:
            return state;
    }
};

export default restaurantOrderReducer;
