import * as actionTypes from './ActionType';

const initialState = {
    restaurantOrders: [],   // List of current page restaurant orders
    totalOrders: 0,        // Total number of orders
    currentPage: 0,        // Current page number
    totalPages: 0,         // Total number of pages
    pageSize: 10,          // Items per page
    loading: false,        // Loading state for API requests
    error: null,           // Holds any error messages
    message: null          // Success messages
};

const restaurantOrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_RESTAURANT_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case actionTypes.UPDATE_ORDER_STATUS_REQUEST:
            return {
                ...state,
                error: null
                // Don't set loading: true here for better UX
            };

        case actionTypes.GET_RESTAURANT_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurantOrders: action.payload.content || action.payload,
                totalOrders: action.payload.totalItems || action.payload.length,
                currentPage: action.payload.currentPage || 0,
                totalPages: action.payload.totalPages || 1,
                pageSize: action.payload.itemsPerPage || 10
            };

        // Update Order Status
        case actionTypes.UPDATE_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                restaurantOrders: state.restaurantOrders.map(order =>
                    order.id === action.payload.id
                        ? { ...order, orderStatus: action.payload.orderStatus || order.orderStatus }
                        : order
                ),
                message: "Order status updated successfully!"
            };


        // case actionTypes.ADD_NEW_ORDER_OPTIMISTIC:

        //     return {
        //         ...state,
        //         restaurantOrders: [action.payload, ...state.restaurantOrders],
        //         totalOrders: state.totalOrders + 1,
        //     };

        case actionTypes.ADD_NEW_ORDER_OPTIMISTIC:
            // Check if order already exists
            const orderExists = state.restaurantOrders.some(order => order.id === action.payload.id);
            if (orderExists) {
                return state;
            }
            return {
                ...state,
                restaurantOrders: [action.payload, ...state.restaurantOrders],
                totalOrders: state.totalOrders + 1,
            };

        // Order Status Update optimization
        case actionTypes.UPDATE_ORDER_STATUS_OPTIMISTIC:
            return {
                ...state,
                restaurantOrders: state.restaurantOrders.map(order =>
                    order.id === action.payload.orderId
                        ? { ...order, orderStatus: action.payload.orderStatus }
                        : order
                )
            };

        case actionTypes.SET_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.payload
            };

        case actionTypes.SET_PAGE_SIZE:
            return {
                ...state,
                pageSize: action.payload,
                currentPage: 0 // Reset to first page when page size changes
            };

        case actionTypes.GET_RESTAURANT_ORDER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                restaurantOrders: state.restaurantOrders, // Keep existing orders on fail
                message: null
            };

        case actionTypes.UPDATE_ORDER_STATUS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                message: null
                // Don't clear restaurantOrders on update failure
            };

        default:
            return state;
    }
};

export default restaurantOrderReducer;