import * as actionTypes from './ActionType';

const initialState = {
    orders: [],         // List of user orders
    currentOrder: null, // Holds the newly created order
    loading: false,     // Loading state for API requests
    error: null,        // Holds any error messages
    message: null       // Success messages
};


const orderReducer = (state = initialState, action) => {
    switch (action.type) {

        //  REQUEST CASES (Start Loading)
        case actionTypes.CREATE_ORDER_REQUEST:
        case actionTypes.GET_USER_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        //  SUCCESS CASES

        // Create Order
        case actionTypes.CREATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                currentOrder: action.payload,                  // Store the newly created order
                orders: [...state.orders, action.payload],     // Add new order to the order history
                message: "Order created successfully!"         // Success message
            };

        // Get User Orders
        case actionTypes.GET_USER_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload                         // Load all user orders
            };

        //  FAIL CASES (Handle Errors)
        case actionTypes.CREATE_ORDER_FAIL:
        case actionTypes.GET_USER_ORDER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,                         // Set error message
                message: null
            };

        // DEFAULT CASE (Return Current State)
        default:
            return state;
    }
};

export default orderReducer;
