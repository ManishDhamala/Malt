import * as actionTypes from './ActionType';

const initialState = {
    cart: null,            // Holds the cart data
    cartItems: [],         // List of all items in the cart
    loading: false,        // Loading state for API requests
    error: null,           // Holds any error messages
    message: null          // Success messages
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {

        //  REQUEST CASES (Start Loading)
        case actionTypes.FIND_CART_REQUEST:
        case actionTypes.GET_ALL_CART_ITEM_REQUEST:
        case actionTypes.ADD_ITEM_TO_CART_REQUEST:
        case actionTypes.UPDATE_CART_ITEM_REQUEST:
        case actionTypes.REMOVE_CART_ITEM_REQUEST:
        case actionTypes.CLEAR_CART_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        //  SUCCESS CASES

        // Find Cart
        case actionTypes.FIND_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                cart: action.payload,       // Set the found cart
                cartItems: action.payload.items || [] // Extract items if available
            };

        // Get All Cart Items
        case actionTypes.GET_ALL_CART_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: action.payload  // Load all cart items
            };

        // Add Item to Cart
        case actionTypes.ADD_ITEM_TO_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: [...state.cartItems, action.payload], // Add new item
                message: "Item added to cart successfully!"
            };

        // Update Cart Item
        case actionTypes.UPDATE_CART_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: state.cartItems.map(item =>
                    item.id === action.payload.id
                        ? { ...item, ...action.payload } // Update the specific cart item
                        : item
                ),
                message: "Cart item updated successfully!"
            };

        // Remove Cart Item
        case actionTypes.REMOVE_CART_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: state.cartItems.filter(item => item.id !== action.payload), // Remove item by ID
                message: "Item removed from cart successfully!"
            };

        // Clear Cart
        case actionTypes.CLEAR_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: [],    // Clear all items from the cart
                message: "Cart cleared successfully!"
            };

        //  FAIL CASES (Handle Errors)
        case actionTypes.FIND_CART_FAIL:
        case actionTypes.GET_ALL_CART_ITEM_FAIL:
        case actionTypes.ADD_ITEM_TO_CART_FAIL:
        case actionTypes.UPDATE_CART_ITEM_FAIL:
        case actionTypes.REMOVE_CART_ITEM_FAIL:
        case actionTypes.CLEAR_CART_FAIL:
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

export default cartReducer;
